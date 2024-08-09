# library-management-system

## Overview
BookVista is a web application designed to facilitate the management and distribution of e-books across various sections of an online library. The system enables users to issue, return, and manage e-books efficiently, offering a seamless experience for both users and administrators.

## Features
* User Authentication: Secure user login and registration.
* E-Book Management: Users can browse, issue, return e-books and provide feedback.
* Admin Dashboard: Librarian can add, deleteand update e-books and sections. They can grant and revoke user e-book requests.
* Visual Representation : Librarian can view statistics about active user, distribution of books across sections, requests granted/revoked, etc.
* Search Functionality: Users can search for books by title, author, or section.
* Email Notifications: Users receive notifications reminding them to return the book one day before the returnDate.
* Monthly Report Generation : Librarian receives a monthly report regarding the e-book requests via email.
* Task Scheduling: Background tasks for email notifications and other periodic jobs.
* Data Export: Administrators can export user and book data, which is sent via email.
* Dummy Payment Portal : Users can buy an e-book using a dummy payment portal.
 
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
