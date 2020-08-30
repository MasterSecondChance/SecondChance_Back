const usersMock = [
    {
        "_id": "5f493ae3a7981400080172c1",
        "userName": "freehyoga",
        "phone": "3007777777",
        "password": "$2b$10$kLTNvGBpFItCkwN/dz4Au.ClhAOuhAp2CaRILEg8zuNPWjM3idPHm",
        "urlPhoto": "https://trode-s3.s3.amazonaws.com/itsme-1598634661923.jpg"
    },
    {
        "_id": "5f4856b5e44df900089973a5",
        "userName": "Camilo",
        "phone": "3203889858",
        "password": "$2b$10$5VND/eXc5sI//4JOyeqK1O/8e8oK0oLrZT7xspvUzd9CzLDgmyLOq",
        "urlPhoto": "https://trode-s3.s3.amazonaws.com/87a7338-1598576281103.png",
        "email": "sistemas.cno@gmail.com"
    },
    {
        "_id": "5f45dd00671cc027f482fe1b",
        "userName": "afcarrion",
        "email": "afcarrion@example.com",
        "phone": "3001234567",
        "password": "$2b$10$g2lHTPFVix6rvAu0FmO2OuFSjwT7lwovmxKMq5TAQZ5OQGQnorl92",
        "urlPhoto": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png"
    },
    {
        "_id": "5f45dd19671cc027f482fe1c",
        "userName": "fernanda",
        "email": "fernanda@example.com",
        "phone": "3007654321",
        "password": "$2b$10$KqHdoch5r/fy0dNVLP1ewe0pbKO69gJUOZzJ6.cQcX8hG1goUX0QO",
        "urlPhoto": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png"
    },
];

function filteredUsersMock(phone){
    return usersMock.filter(user => user.phone.includes(phone));
}
function filteredUserByPhone(phone){
    return usersMock.filter(user => user.phone === phone);
}
function deleteUserMock(id){
    return usersMock.filter(user => user._id === id);
}
class UsersServiceMock{
    async getUsers(){
        return Promise.resolve(usersMock);
    }

    async createUser(){
        return Promise.resolve(usersMock[0]);
    }
}

module.exports = {
    usersMock,
    filteredUsersMock,
    filteredUserByPhone,
    deleteUserMock,
    UsersServiceMock,
}