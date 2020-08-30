const matchesMock = [
    {
        "_id": "5f492e68381a6800085fc579",
        "nameFirst": "Alexander",
        "phoneFirst": "3203889058",
        "urlPhotoArticleFirst": "https://trode-s3.s3.amazonaws.com/87a7338-1598566291631.png",
        "firstArticleName": "Sofia 3203889058",
        "nameSecond": "Sofia",
        "phoneSecond": "3203889050",
        "urlPhotoArticleSecond": "https://trode-s3.s3.amazonaws.com/87a7338-1598566291631.png",
        "secondArticleName": "Sofia 3203889058",
        "urlChat": "https://api.whatsapp.com/send?phone=3203889058"
    },
    {
        "_id": "5f492e68381a6800085fc57a",
        "nameFirst": "Sofia",
        "phoneFirst": "3203889050",
        "urlPhotoArticleFirst": "https://trode-s3.s3.amazonaws.com/87a7338-1598566291631.png",
        "firstArticleName": "Sofia 3203889058",
        "nameSecond": "Alexander",
        "phoneSecond": "3203889058",
        "urlPhotoArticleSecond": "https://trode-s3.s3.amazonaws.com/87a7338-1598566291631.png",
        "secondArticleName": "Sofia 3203889058",
        "urlChat": "https://api.whatsapp.com/send?phone=3203889058",
        "date": null
    },
    {
        "_id": "5f4a1ca9e179874bf5f9d3a7",
        "nameFirst": "fernanda",
        "phoneFirst": "3007654321",
        "urlPhotoArticleFirst": "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg",
        "firstArticleName": "My little skirt1",
        "nameSecond": "Alexander",
        "phoneSecond": "3203889058",
        "urlPhotoArticleSecond": "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg",
        "secondArticleName": "My little skirt2",
        "urlChat": "https://api.whatsapp.com/send?phone=3007654321",
        "date": "27/08/2020 11:50pm"
    },
    {
        "_id": "5f4a1ca9e179874bf5f9d3a8",
        "nameFirst": "Alexander",
        "phoneFirst": "3203889058",
        "urlPhotoArticleFirst": "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg",
        "firstArticleName": "My little skirt2",
        "nameSecond": "fernanda",
        "phoneSecond": "3007654321",
        "urlPhotoArticleSecond": "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg",
        "secondArticleName": "My little skirt1",
        "urlChat": "https://api.whatsapp.com/send?phone=3007654321",
        "date": "27/08/2020 11:50pm"
    }
];

function filteredMatchesMock(matchesId){
    return matchesMock.filter(matches => matches._id.includes(matchesId));
}

class MatchesServiceMock{
    async getMatches(){
        return Promise.resolve(matchesMock);
    }

    async createMatches(){
        return Promise.resolve(matchesMock[0]);
    }
}

module.exports = {
    matchesMock,
    filteredMatchesMock,
    MatchesServiceMock,
}