# Linker
<p>
<a href="https://github.com/IK-R-S/Linker"><img src="https://img.shields.io/github/license/ik-r-s/linker?label=LINKER%20LICENSE&style=for-the-badge" alt="License"></a>
 
</p>
One-stop solution for cross-platform link and note management. 🖥️📲
 

## Description

**Linker: Simplify Cross-Platform Link and Note Management**

Introducing Linker, your all-in-one solution for managing links and notes across platforms. Built with Node.js, Express, Electron, and React Native, Linker offers a seamless experience on both desktop and mobile.

Organize and access your favorite links effortlessly. Say goodbye to scattered bookmarks and hello to a centralized hub. Capture and store notes with ease, whether it's ideas, to-do lists, or reminders.

With a secure backend and encrypted sessions, your data is protected. Linker puts privacy and control in your hands.

Simplify your digital life with Linker. Visit our GitHub repository to learn more and download the app. Experience efficient link and note management today with Linker.

## Features

- User registration
- User authentication
- Link and note creation/management
- Cross-Platform intuitive and user-friendly interface

## Prerequisites

- Node.js installed
- Configured PostgreSQL database

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/IK-R-S/Linker.git
   ```

2. Install backend dependencies:

   ```bash
   cd /Linker/Application/
   npm install
   ```

## Database Configuration

1. Open the `server.js` file in the `linker/backend` directory.

2. Fill in the connection information for your PostgreSQL database:

   ```javascript
   const server = {
       host: 'localhost',
       database: 'database_name',
       user: 'database_user',
       password: 'database_password',
       port: 'database_port'
   };

   module.exports = server;
   ```

## Usage

1. Start the backend server:

   ```bash
   cd /Linker/Application/
   npm start or nodemon
   ```

4. Access the application in your browser at [http://localhost:3000](http://localhost:3000).

## Contribution

Contributions are welcome! If you want to contribute to Linker, follow the steps below:

1. Fork the repository.

2. Create a branch for your contribution:

   ```bash
   git checkout -b my-contribution
   ```

3. Make the desired changes and commit:

   ```bash
   git commit -m "My contribution"
   ```

4. Push the changes to your forked repository:

   ```bash
   git push origin my-contribution
   ```

5. Open a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).
