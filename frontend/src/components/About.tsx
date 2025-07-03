import React from 'react';
import './About.css'; // We'll create this CSS file next

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>About This Project</h1>
      <p>
        The Research Autominer is a powerful tool designed to streamline data processing and analysis.
        It allows users to upload CSV files, apply a series of predefined or custom functions (manuscripts),
        and generate new insights from their data. The project aims to automate repetitive data manipulation
        tasks, enabling researchers and analysts to focus on higher-level interpretation.
      </p>
      <h2>About the Creator</h2>
      <p>
        This project was created by Ariel Rotem. Ariel is passionate about leveraging technology to solve real-world problems,
        with a particular interest in data science, automation, and user-friendly software development.
        This tool is a testament to the belief that complex data tasks can be simplified and made accessible to a wider audience.
      </p>
      <p>
        For more information or to contribute, please visit the project's GitHub repository.
      </p>
    </div>
  );
};

export default About;
