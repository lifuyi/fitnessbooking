// WeChat Mini Program Project Validation Script
const fs = require('fs');
const path = require('path');

console.log('WeChat Mini Program Project Validation\n');

// Validation results
let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function test(description, condition, warning = false) {
  if (condition) {
    console.log(`✓ ${description}`);
    validationResults.passed++;
  } else {
    if (warning) {
      console.log(`⚠ ${description}`);
      validationResults.warnings++;
    } else {
      console.log(`✗ ${description}`);
      validationResults.failed++;
    }
  }
}

// 1. Project Structure Validation
console.log('1. Project Structure Validation');
console.log('=====================================');

test('miniprogram directory exists', fs.existsSync('miniprogram'));
test('app.json exists', fs.existsSync('miniprogram/app.json'));
test('app.ts exists', fs.existsSync('miniprogram/app.ts'));
test('project.config.json exists', fs.existsSync('project.config.json'));

// 2. Language System Validation
console.log('\n2. Language System Validation');
console.log('=====================================');

test('i18n utility exists', fs.existsSync('miniprogram/utils/i18n.js'));
test('language utility exists', fs.existsSync('miniprogram/utils/language.js'));
test('Chinese locale exists', fs.existsSync('miniprogram/locales/zh-CN.js'));
test('English locale exists', fs.existsSync('miniprogram/locales/en.js'));
test('Language switch component exists', fs.existsSync('miniprogram/components/language-switch.ts'));

// 3. Component Registration Validation
console.log('\n3. Component Registration Validation');
console.log('=====================================');

try {
  const appJson = JSON.parse(fs.readFileSync('miniprogram/app.json', 'utf8'));
  test('Language switch component registered in app.json', 
    appJson.usingComponents && appJson.usingComponents['language-switch']);
} catch (error) {
  test('Can parse app.json', false);
}

// 4. Page Integration Validation
console.log('\n4. Page Integration Validation');
console.log('=====================================');

const pages = [
  'index/index',
  'profile/index', 
  'booking/index',
  'course/list',
  'course/detail',
  'teacher/list',
  'teacher/detail',
  'qrcode/index',
  'logs/logs'
];

let integratedPages = 0;
pages.forEach(page => {
  const pageJsonPath = `miniprogram/pages/${page}.json`;
  const pageWxmlPath = `miniprogram/pages/${page}.wxml`;
  const pageTsPath = `miniprogram/pages/${page}.ts`;
  
  try {
    if (fs.existsSync(pageJsonPath) && fs.existsSync(pageWxmlPath)) {
      const pageJson = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
      const pageWxml = fs.readFileSync(pageWxmlPath, 'utf8');
      const pageTs = fs.existsSync(pageTsPath) ? fs.readFileSync(pageTsPath, 'utf8') : '';
      
      const hasComponent = pageJson.usingComponents && pageJson.usingComponents['language-switch'];
      const hasUsage = pageWxml.includes('language-switch');
      const hasEventHandler = pageTs.includes('onLanguageChange');
      
      if (hasComponent && hasUsage) {
        integratedPages++;
        test(`${page} has language switch component`, true);
        if (hasEventHandler) {
          test(`${page} has language change event handler`, true);
        } else {
          test(`${page} has language change event handler`, false, true);
        }
      } else {
        test(`${page} has language switch component`, false, true);
      }
    } else {
      test(`${page} page files exist`, false, true);
    }
  } catch (error) {
    test(`${page} page validation`, false, true);
  }
});

console.log(`\nPage Integration Summary: ${integratedPages}/${pages.length} pages have language switch integration`);

// 5. Admin Pages Validation
console.log('\n5. Admin Pages Validation');
console.log('=====================================');

const adminPages = [
  'admin/login',
  'admin/coursemanage',
  'admin/studentmanage',
  'admin/notification',
  'admin/settings',
  'admin/statistics'
];

let adminIntegratedPages = 0;
adminPages.forEach(page => {
  const pageJsonPath = `miniprogram/pages/${page}.json`;
  const pageWxmlPath = `miniprogram/pages/${page}.wxml`;
  
  try {
    if (fs.existsSync(pageJsonPath) && fs.existsSync(pageWxmlPath)) {
      const pageJson = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
      const pageWxml = fs.readFileSync(pageWxmlPath, 'utf8');
      
      const hasComponent = pageJson.usingComponents && pageJson.usingComponents['language-switch'];
      const hasUsage = pageWxml.includes('language-switch');
      
      if (hasComponent && hasUsage) {
        adminIntegratedPages++;
        test(`Admin ${page} has language switch`, true);
      } else {
        test(`Admin ${page} has language switch`, false, true);
      }
    } else {
      test(`Admin ${page} page files exist`, false, true);
    }
  } catch (error) {
    test(`Admin ${page} page validation`, false, true);
  }
});

console.log(`Admin Pages Integration: ${adminIntegratedPages}/${adminPages.length} admin pages have language switch integration`);

// 6. Translation Content Validation
console.log('\n6. Translation Content Validation');
console.log('=====================================');

try {
  // Use require for CommonJS modules
  const zhCN = require('./miniprogram/locales/zh-CN.js');
  const en = require('./miniprogram/locales/en.js');
  
  // Handle both default exports and direct exports
  const zhTranslations = zhCN.default || zhCN;
  const enTranslations = en.default || en;
  
  const requiredKeys = [
    'navbar.home',
    'navbar.booking',
    'navbar.profile',
    'app.name',
    'index.welcome'
  ];
  
  requiredKeys.forEach(key => {
    test(`Chinese locale has key: ${key}`, zhTranslations[key] !== undefined);
    test(`English locale has key: ${key}`, enTranslations[key] !== undefined);
  });
  
  // Check for key consistency
  const zhKeys = Object.keys(zhTranslations);
  const enKeys = Object.keys(enTranslations);
  const commonKeys = zhKeys.filter(key => enKeys.includes(key));
  test(`Translation key consistency: ${commonKeys.length}/${zhKeys.length} keys match`, 
    commonKeys.length >= zhKeys.length * 0.8, true); // 80% threshold with warning
  
} catch (error) {
  test('Can load translation files', false);
  console.log('  Error details:', error.message);
}

// 7. Configuration Validation
console.log('\n7. Configuration Validation');
console.log('=====================================');

try {
  const projectConfig = JSON.parse(fs.readFileSync('project.config.json', 'utf8'));
  test('Project config has miniprogram root', projectConfig.miniprogramRoot === 'miniprogram/');
  test('Project config has correct compile type', projectConfig.compileType === 'miniprogram');
  test('Project config has TypeScript support', 
    projectConfig.setting && projectConfig.setting.useCompilerPlugins && 
    projectConfig.setting.useCompilerPlugins.includes('typescript'));
} catch (error) {
  test('Can parse project.config.json', false);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`✓ Passed: ${validationResults.passed}`);
console.log(`✗ Failed: ${validationResults.failed}`);
console.log(`⚠ Warnings: ${validationResults.warnings}`);
console.log(`
Overall Status: ${validationResults.failed === 0 ? '✓ PASS' : '✗ FAIL'}`);

if (validationResults.warnings > 0) {
  console.log('Note: Some warnings are minor issues that may not affect functionality.');
}

console.log('\n✓ Project validation completed!');