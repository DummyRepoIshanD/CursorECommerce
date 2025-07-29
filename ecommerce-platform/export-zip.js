const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating zip file of the e-commerce platform...');

try {
  // Create zip file using system command
  const zipFileName = 'ecommerce-platform.zip';
  const sourceDir = '.';
  
  // Check if zip command is available
  try {
    execSync('which zip', { stdio: 'ignore' });
  } catch (error) {
    console.log('zip command not found, trying alternative method...');
    
    // Alternative method using tar
    try {
      execSync('which tar', { stdio: 'ignore' });
      const command = `tar -czf ${zipFileName} --exclude=node_modules --exclude=.next --exclude=.git --exclude=${zipFileName} .`;
      execSync(command, { cwd: sourceDir });
      console.log(`✅ Successfully created ${zipFileName} using tar`);
    } catch (tarError) {
      console.error('❌ Neither zip nor tar commands are available');
      console.log('Manual export instructions:');
      console.log('1. Copy the entire ecommerce-platform folder');
      console.log('2. Exclude node_modules, .next, and .git folders');
      console.log('3. Create a zip file manually');
      process.exit(1);
    }
    return;
  }
  
  // Use zip command
  const command = `zip -r ${zipFileName} . -x "node_modules/*" ".next/*" ".git/*" "${zipFileName}"`;
  execSync(command, { cwd: sourceDir });
  
  console.log(`✅ Successfully created ${zipFileName}`);
  console.log(`📁 File location: ${path.resolve(sourceDir, zipFileName)}`);
  console.log('📦 The zip file contains the complete e-commerce platform with intentional bugs');
  
} catch (error) {
  console.error('❌ Error creating zip file:', error.message);
  console.log('\n📋 Manual export instructions:');
  console.log('1. Copy the entire ecommerce-platform folder');
  console.log('2. Exclude the following folders/files:');
  console.log('   - node_modules/');
  console.log('   - .next/');
  console.log('   - .git/');
  console.log('3. Create a zip file manually');
}