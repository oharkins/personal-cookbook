const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize Ajv with all formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load the schema
const schema = JSON.parse(fs.readFileSync('schemas/recipes.schema.json', 'utf8'));
const validate = ajv.compile(schema);

// Get all recipe files
const recipesDir = 'recipes';
const recipeFiles = fs.readdirSync(recipesDir)
    .filter(file => file.endsWith('.json'));

let allValid = true;

console.log('Validating recipe files...\n');

// Validate each recipe
recipeFiles.forEach(file => {
    const filePath = path.join(recipesDir, file);
    const recipe = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const isValid = validate(recipe);
    
    if (!isValid) {
        allValid = false;
        console.log(`❌ Validation errors in ${file}:`);
        validate.errors.forEach(error => {
            console.log(`  Path: ${error.instancePath || 'root'}`);
            console.log(`  Message: ${error.message}`);
        });
        console.log('');
    }
});

if (allValid) {
    console.log('✅ All recipes are valid!');
} else {
    console.log('❌ Some recipes failed validation. Please fix the errors above.');
    process.exit(1);
} 