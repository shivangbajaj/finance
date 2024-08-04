const { exec } = require('child_process');
const path = require('path');

const runMatlabScript = () => {
  const scriptPath = path.join(__dirname, 'analyze_stock_data.m');
  exec(`/Applications/MATLAB_R2024a.app/Contents/MacOS/matlab -nodisplay -r "run('${scriptPath}'); exit"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing MATLAB script: ${error}`);
      return;
    }
    console.log(`MATLAB Output: ${stdout}`);
    if (stderr) {
      console.error(`MATLAB Error Output: ${stderr}`);
    }
  });
};

// Run MATLAB script
runMatlabScript();
