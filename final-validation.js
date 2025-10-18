// Final WeChat Mini Program Language System Validation
const fs = require('fs');
const path = require('path');

console.log('🌐 WeChat Mini Program Language System - Final Validation\n');

let passedTests = 0;
let totalTests = 0;

function test(description, condition) {
  totalTests++;
  if (condition) {
    console.log(`✅ ${description}`);
    passedTests++;
  } else {
    console.log(`❌ ${description}`);
  }
}

// 1. Core Language System Files
console.log('📁 1. Core Language System Files');
console.log('=====================================');
test('i18n.js module exists', fs.existsSync('miniprogram/utils/i18n.js'));
test('language.js utility exists', fs.existsSync('miniprogram/utils/language.js'));
test('Chinese locale file exists', fs.existsSync('miniprogram/locales/zh-CN.js'));
test('English locale file exists', fs.existsSync('miniprogram/locales/en.js'));
test('Language switch component exists', fs.existsSync('miniprogram/components/language-switch.ts'));

// 2. Module Syntax Validation
console.log('\n🔧 2. Module Syntax Validation');
console.log('=====================================');

try {
  const i18nContent = fs.readFileSync('miniprogram/utils/i18n.js', 'utf8');
  test('i18n.js uses CommonJS exports', !i18nContent.includes('export default') && i18nContent.includes('module.exports'));
  test('i18n.js has no ES6 imports', !i18nContent.includes('import '));
} catch (error) {
  test('Can read i18n.js file', false);
}

try {
  const zhCNContent = fs.readFileSync('miniprogram/locales/zh-CN.js', 'utf8');
  test('zh-CN.js uses CommonJS exports', !zhCNContent.includes('export default') && zhCNContent.includes('module.exports'));
} catch (error) {
  test('Can read zh-CN.js file', false);
}

try {
  const enContent = fs.readFileSync('miniprogram/locales/en.js', 'utf8');
  test('en.js uses CommonJS exports', !enContent.includes('export default') && enContent.includes('module.exports'));
} catch (error) {
  test('Can read en.js file', false);
}

// 3. Component Integration
console.log('\n🔌 3. Component Integration');
console.log('=====================================');

try {
  const appJson = JSON.parse(fs.readFileSync('miniprogram/app.json', 'utf8'));
  test('Language switch registered in app.json', appJson.usingComponents && appJson.usingComponents['language-switch']);
} catch (error) {
  test('Can parse app.json', false);
}

// Check component structure
try {
  const componentContent = fs.readFileSync('miniprogram/components/language-switch.ts', 'utf8');
  test('Component has switchLanguage method', componentContent.includes('switchLanguage'));
  test('Component triggers languagechange event', componentContent.includes('languagechange'));
  test('Component uses proper i18n import', componentContent.includes('require') && componentContent.includes('i18n'));
} catch (error) {
  test('Can read language-switch component', false);
}

// 4. Page Integration Check
console.log('\n📄 4. Page Integration Check');
console.log('=====================================');

const mainPages = [
  'index/index',
  'profile/index', 
  'booking/index',
  'course/list',
  'course/detail',
  'teacher/list',
  'teacher/detail'
];

let integratedPages = 0;
mainPages.forEach(page => {
  try {
    const pageJsonPath = `miniprogram/pages/${page}.json`;
    const pageWxmlPath = `miniprogram/pages/${page}.wxml`;
    
    if (fs.existsSync(pageJsonPath) && fs.existsSync(pageWxmlPath)) {
      const pageJson = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
      const pageWxml = fs.readFileSync(pageWxmlPath, 'utf8');
      
      const hasComponent = pageJson.usingComponents && pageJson.usingComponents['language-switch'];
      const hasUsage = pageWxml.includes('language-switch');
      
      if (hasComponent && hasUsage) {
        integratedPages++;
        test(`${page} has language switch integration`, true);
      } else {
        test(`${page} has language switch integration`, false);
      }
    } else {
      test(`${page} page files exist`, false);
    }
  } catch (error) {
    test(`${page} page validation`, false);
  }
});

// 5. Translation Content Validation
console.log('\n🌍 5. Translation Content Validation');
console.log('=====================================');

try {
  // Test basic module loading (syntax check)
  const i18nModule = require('./miniprogram/utils/i18n.js');
  test('i18n module loads without syntax errors', typeof i18nModule === 'object');;
  test('i18n module has setLanguage method', typeof i18nModule.setLanguage === 'function');
  test('i18n module has getLanguage method', typeof i18nModule.getLanguage === 'function');
  test('i18n module has t method', typeof i18nModule.t === 'function');
} catch (error) {
  test('i18n module loads without syntax errors', false);
  console.log('  Error details:', error.message);
}

// Check translation keys
const requiredTranslations = [
  'navbar.home',
  'navbar.booking',
  'navbar.profile',
  'app.name',
  'index.welcome'
];

try {
  const zhCN = require('./miniprogram/locales/zh-CN.js');
  const en = require('./miniprogram/locales/en.js');
  const zhTranslations = zhCN.default || zhCN;
  const enTranslations = en.default || en;
  
  requiredTranslations.forEach(key => {
    test(`Chinese translation has key: ${key}`, zhTranslations[key] !== undefined);
    test(`English translation has key: ${key}`, enTranslations[key] !== undefined);
  });
} catch (error) {
  test('Translation files load without errors', false);
}

// 6. Language Utility Functions
console.log('\n🛠️  6. Language Utility Functions');
console.log('=====================================');

try {
  const languageContent = fs.readFileSync('miniprogram/utils/language.js', 'utf8');
  test('language.js has setTabBarLanguage function', languageContent.includes('setTabBarLanguage'));
  test('language.js has initLanguage function', languageContent.includes('initLanguage'));
  test('language.js uses CommonJS exports', languageContent.includes('module.exports'));
} catch (error) {
  test('Can read language.js file', false);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('🎯 FINAL VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

const successRate = (passedTests / totalTests * 100).toFixed(1);
console.log(`📊 Success Rate: ${successRate}%`);

if (successRate >= 80) {
  console.log('\n🎉 SUCCESS: Language switching system is ready for WeChat Mini Program!');
  console.log('✨ The system should work correctly when deployed to WeChat Developer Tools.');
} else if (successRate >= 60) {
  console.log('\n⚠️  WARNING: Language system has some issues but may still function.');
  console.log('🔧 Review the failed tests above and fix critical issues.');
} else {
  console.log('\n❌ FAILURE: Language system has significant issues that need fixing.');
  console.log('🚨 Address the failed tests before deployment.');
}

console.log('\n✅ Validation completed!');
console.log('\n📋 Next Steps:');
console.log('1. Open WeChat Developer Tools');
console.log('2. Import this project');
console.log('3. Test language switching functionality');
console.log('4. Verify tabBar language updates');
console.log('5. Check all pages update correctly when language changes');