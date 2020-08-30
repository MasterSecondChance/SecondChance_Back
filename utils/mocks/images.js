const imagesMock = [
    {
        "_id": "5f47781a63706c000776d429",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/D58-1598519322017.jpg"
    },
    {
        "_id": "5f4778e406eecb000958f819",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/j-1598519524017.jpg"
    },
    {
        "_id": "5f477b60a43d060007baf087",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/abeb818e-564d-49d7-8c49-22d651e699d4-1598520159770.jpeg"
    },
    {
        "_id": "5f477b84a43d060007baf088",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/abeb818e-564d-49d7-8c49-22d651e699d4-1598520195574.jpeg"
    },
    {
        "_id": "5f477bbba43d060007baf089",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/abeb818e-564d-49d7-8c49-22d651e699d4-1598520250721.jpeg"
    },
    {
        "_id": "5f477d16a43d060007baf08a",
        "profilePicture": "https://trode-s3.s3.amazonaws.com/j-1598520597943.jpg"
    }
];

function filteredImagesMock(imagesId){
    return imagesMock.filter(image => image._id.includes(imagesId));
}

class ImageServiceMock{
    async getImages(){
        return Promise.resolve(imagesMock);
    }

    async createImage(){
        return Promise.resolve(imagesMock[0]);
    }
}

module.exports = {
    imagesMock,
    filteredImagesMock,
    ImageServiceMock,
}