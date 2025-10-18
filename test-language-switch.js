// Test script to verify language switching functionality
const fs = require('fs');
const path = require('path');

console.log('Testing Language Switching Functionality...\n');

// Test 1: Check if i18n module exists and has required methods
console.log('1. Testing i18n module...');
try {
  // Since this is a WeChat Mini Program, we can't directly require the modules
  // But we can check if the files exist and have the expected structure
  
  const i18nPath = path.join(__dirname, 'miniprogram/utils/i18n.js');
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');
  
  if (i18nContent.includes('setLanguage') && 
      i18nContent.includes('getLanguage') && 
      i18nContent.includes('t(')) {
    console.log('✓ i18n module has required methods');
  } else {
    console.log('✗ i18n module missing required methods');
  }
} catch (error) {
  console.log('✗ i18n module not found or error reading:', error.message);
}

// Test 2: Check language files
console.log('\n2. Testing language files...');
const languages = ['zh-CN', 'en'];
languages.forEach(lang => {
  try {
    const langPath = path.join(__dirname, `miniprogram/locales/${lang}.js`);
    const langContent = fs.readFileSync(langPath, 'utf8');
    
    // Check for required translation keys
    const requiredKeys = [
      'navbar.home',
      'navbar.booking', 
      'navbar.profile',
      'app.name',
      'index.welcome'
    ];
    
    const missingKeys = requiredKeys.filter(key => !langContent.includes(key));
    if (missingKeys.length === 0) {
      console.log(`✓ ${lang}.js has all required keys`);
    } else {
      console.log(`✗ ${lang}.js missing keys:`, missingKeys);
    }
  } catch (error) {
    console.log(`✗ ${lang}.js not found or error reading:`, error.message);
  }
});

// Test 3: Check language switching component
console.log('\n3. Testing language switching component...');
try {
  const componentPath = path.join(__dirname, 'miniprogram/components/language-switch.ts');
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  if (componentContent.includes('switchLanguage') && 
      componentContent.includes('setLanguage') &&
      componentContent.includes('triggerEvent')) {
    console.log('✓ Language switch component has required functionality');
  } else {
    console.log('✗ Language switch component missing required functionality');
  }
} catch (error) {
  console.log('✗ Language switch component not found or error reading:', error.message);
}

// Test 4: Check language utility module
console.log('\n4. Testing language utility module...');
try {
  const utilPath = path.join(__dirname, 'miniprogram/utils/language.js');
  const utilContent = fs.readFileSync(utilPath, 'utf8');
  
  if (utilContent.includes('setTabBarLanguage') && 
      utilContent.includes('wx.setTabBarItem')) {
    console.log('✓ Language utility has tabBar language switching');
  } else {
    console.log('✗ Language utility missing tabBar language switching');
  }
} catch (error) {
  console.log('✗ Language utility not found or error reading:', error.message);
}

// Test 5: Check component registration in app.json
console.log('\n5. Testing component registration...');
try {
  const appJsonPath = path.join(__dirname, 'miniprogram/app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  if (appJson.usingComponents && appJson.usingComponents['language-switch']) {
    console.log('✓ Language switch component registered in app.json');
  } else {
    console.log('✗ Language switch component not registered in app.json');
  }
} catch (error) {
  console.log('✗ app.json not found or error reading:', error.message);
}

// Test 6: Check pages have language switch integration
console.log('\n6. Testing page integration...');
const pages = ['index', 'profile', 'booking', 'course/list', 'teacher/list'];
let integratedPages = 0;

pages.forEach(page => {
  try {
    const pageJsonPath = path.join(__dirname, `miniprogram/pages/${page}.json`);
    const pageWxmlPath = path.join(__dirname, `miniprogram/pages/${page}.wxml`);
    
    if (fs.existsSync(pageJsonPath) && fs.existsSync(pageWxmlPath)) {
      const pageJson = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
      const pageWxml = fs.readFileSync(pageWxmlPath, 'utf8');
      
      const hasComponent = pageJson.usingComponents && pageJson.usingComponents['language-switch'];
      const hasUsage = pageWxml.includes('language-switch');
      
      if (hasComponent && hasUsage) {
        integratedPages++;
        console.log(`✓ ${page} page has language switch integration`);
      } else {
        console.log(`✗ ${page} page missing language switch integration`);
      }
    }
  } catch (error) {
    console.log(`✗ Error checking ${page} page:`, error.message);
  }
});

console.log(`\nLanguage Switch Test Summary:`);
console.log(`- Pages with language switch integration: ${integratedPages}/${pages.length}`);

console.log('\n✓ Language switching functionality test completed!');