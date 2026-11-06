import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function scan(page,info,state,expectedTargets) {
  // Use axe's default rule set, with no tag filter or disabled rules.
  const result=await new AxeBuilder({page}).analyze();
  await info.attach(`axe-${state}`,{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.violations).toEqual([]);
  expect(result.incomplete).toEqual([]);
  // A scan that silently stops exercising the isolated trigger is not a regression pass.
  const targets=result.passes.find(rule=>rule.id==='aria-allowed-attr')?.nodes.map(node=>node.target)??[];
  for(const target of expectedTargets)expect(targets).toContainEqual([target]);
}
const fixture = `<!doctype html>
<html lang="en"><head><title>Accessible label regression</title>
<style>body{font:16px sans-serif;color:#111;background:#fff}button,input,select{min-height:44px;margin:12px}section{padding:16px}</style>
</head><body><main><h1>Project collection</h1>
<span id="save-label">Save project</span><button id="save" aria-labelledby="save-label">Save</button>
<label for="status">Status</label><select id="status"><option value="all">All projects</option><option value="planning">Planning</option></select>
<section id="empty" aria-labelledby="empty-title"><h2 id="empty-title">No projects found</h2><button id="reset">Show projects</button></section>
<section id="results" aria-labelledby="results-title" hidden><h2 id="results-title">Projects</h2></section>
<script>
document.querySelector('#save').addEventListener('click', () => document.querySelector('#save').textContent = 'Saved');
document.querySelector('#reset').addEventListener('click', () => {
  document.querySelector('#empty').hidden = true;
  document.querySelector('#results').hidden = false;
  document.querySelector('#status').focus();
});
</script></main></body></html>`;

test('page label-reference read can be followed by a named action', async ({page}) => {
  await page.setContent(fixture);
  expect(await page.evaluate(() => document.querySelector('#save').ariaLabelledByElements.map(el => el.id))).toEqual(['save-label']);
  const save = page.getByRole('button', {name:'Save project', exact:true});
  await expect(save).toHaveAccessibleName('Save project');
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(save).toHaveText('Saved');
});

test('default axe scans and named interactions remain usable in both orders', async ({page},info) => {
  await page.setContent(fixture);
  // Resolve the label in the test runner before axe reads it in the page.
  await expect(page.getByRole('button', {name:'Save project', exact:true})).toBeVisible();
  await expect(page.getByRole('region', {name:'No projects found', exact:true})).toBeVisible();
  await scan(page,info,'initial',['#save','#empty']);
  await expect(page.getByRole('region', {name:'No projects found', exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Show projects', exact:true}).click();
  await page.getByLabel('Status', {exact:true}).selectOption('planning');
  await expect(page.getByLabel('Status', {exact:true})).toHaveValue('planning');
  // Add a new labelled region after an audit, then scan and resolve it again.
  await page.evaluate(() => {
    const article = document.createElement('article');
    article.setAttribute('aria-labelledby', 'new-project-title');
    const heading = document.createElement('h3');
    heading.id = 'new-project-title';
    heading.textContent = 'New project';
    article.append(heading);
    document.querySelector('#results').append(article);
  });
  await scan(page,info,'added-content',['#save','#results','article']);
  await expect(page.getByRole('article', {name:'New project', exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Save project', exact:true}).click();
  await expect(page.locator('#save')).toHaveText('Saved');
});
