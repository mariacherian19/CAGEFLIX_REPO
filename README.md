# CAGEFLIX

SETUP INSTRUCTIONS:

1. Clone the Repository
   Clone the repository to your local machine: git clone https://github.com/mariacherian19/CAGEFLIX_REPO.git
2. Install Dependencies
   Navigate to the project directory and install the necessary dependencies for both Angular and Node.js: npm install
3. Run the Application Locally
   After installing the dependencies, run the Angular application on your local server: ng serve
   This will build and start the app on localhost

Data Preparation:
The frontend of the application was the primary focus, and I have run a Node.js script to process the dataset and generate the necessary JSON files. These JSON files are stored in the assets folder for use in the application. Node js script added in the sscripts folder.

To generate the JSON files from the raw dataset, follow these steps:

Download and save the following dataset files in the scripts/dataset folder:

1. name.basics.tsv

2. title.basics.tsv

3. title.principals.tsv

Run the Script: The Node.js script will automatically process these datasets and generate the JSON files, which will then be saved in the assets folder as 'cage-movies.json' and 'cage-shows.json'.

TECH CHOICES:

1. Angular (Frontend) - I chose Angular for the frontend due to its robustness and scalability. Angular provides a powerful framework for building single-page applications (SPA), with a focus on maintainability, modularity, and testability.

Modular Architecture:
core/: Singleton services (Models,Services).

shared/: Reusable components, pipes, and utilities.

Lazy-loaded feature modules for scalability.

State Management: Angular services (RxJS) for centralized data.

Styling: Angular Material + SCSS for responsive design

Optimized code for better performance

2. Node.js (Backend & Data Processing) - Node.js was used for the data processing part of the application.

Pre-processed IMDB datasets (TSV → JSON) for frontend performance.

Scripts placed in scripts/ for reproducibility.

KNOWN ISSUE:

Although lazy loading is implemented for routes like Home, Movies, and TV Shows, all data is currently being loaded upfront. In the future, it would be more efficient to load only essential data (such as Home and User Details) initially, and lazy-load the remaining data for better performance.

Also Please note that as the IMdb dataset were not providing any images, added few images as part of JSON for a better user expreience.
