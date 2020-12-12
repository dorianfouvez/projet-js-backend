"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const FILE_PATH = __dirname + "/users.json";

class User {
  constructor(username, email, password,isAdmin) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false ;
  }

  /* return a promise with async / await */ 
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    userList.push({ username: this.email, email: this.email, password: hashedPassword ,isAdmin: this.isAdmin });
    saveUserListToFile(FILE_PATH, userList);
    return true;
  }

  /* return a promise with classic promise syntax*/
  checkCredentials(email, password) {
    if (!email || !password) return false;
    let userFound = User.getUserFromList(email);
    console.log("User::checkCredentials:", userFound, " password:", password);
    
    if (!userFound) return Promise.resolve(false);
  
    this.isAdmin = userFound.isAdmin;
    return bcrypt.compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }

  static get list() {
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  static isUser(username) {
    const userFound = User.getUserFromList(username);
    //console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }

  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }
  static isAdmin(username){
    const userFound = User.getUserFromList(username);
    return userFound.isAdmin == true;
  }
  
}

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

module.exports = User;
