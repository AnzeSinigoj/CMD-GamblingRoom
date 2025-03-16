# CMD-GamblingRoom

<mark>**WORK IN PROGRESS!**</mark>

This is a school project where we have to create a gambling game featuring dice and multiplayer options.

 The project is usually done in PHP, but I wrote it in JavaScript since it's just a game and doesn't require backend security.

It works on all screen sizes, from mobile devices to larger screens.

The theme was inspired by CMD colors and has a look similar to how hackers are portrayed in the media.

### Features:
- Multiplayer support
- Ability to change player name and color
- Automatic/manual dice throws
- Option to set the number of rounds per game
- Option to set the number of dice throws per round

### Upcoming Features:
- Will switch to **localStorage** instead of **sessionStorage** and allow restoring user properties:
  - Ensure user data (username, color and game mode) is saved in **localStorage** so that it can persist between sessions.
  - Implement a method to check **localStorage** for existing users and either **restore** their properties or **create new users** if no data is found.
  - Add a **reset button** that clears all user data from **localStorage** when pressed, allowing for fresh user creation.
  - When creating new users, ensure that the reset button hasn’t been clicked, even if you add more users the original ones will still prersist
