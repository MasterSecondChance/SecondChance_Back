const reactionsMock = [
    {
        "_id": "5f49f7040fb52f0008b95ab8",
        "type": "Like",
        "idArticle": "5f44bee92974740008ca0d28",
        "phoneUser": "3155280480",
        "phoneOwner": "3203889058"
    },
    {
        "_id": "5f49f75f534a8c00084d8c13",
        "type": "SuperLike",
        "idArticle": "5f449d36b9d90e0007e06454",
        "phoneUser": "3155280480",
        "phoneOwner": "3019999999"
    },
    {
        "_id": "5f49f794534a8c00084d8c14",
        "type": "Like",
        "idArticle": "5f49dba3567af6000807ae18",
        "phoneUser": "3155280480",
        "phoneOwner": "3007777777"
    },
    {
        "_id": "5f49f7a2534a8c00084d8c15",
        "type": "Like",
        "idArticle": "5f492ca8381a6800085fc578",
        "phoneUser": "3155280480",
        "phoneOwner": "3114687458"
    },
    {
        "_id": "5f49f7bff3865900079e8710",
        "type": "Like",
        "idArticle": "5f49f6dd534a8c00084d8c12",
        "phoneUser": "3155280480",
        "phoneOwner": "3155280480"
    }
];

function filteredReactionsMock(reactionsId){
    return reactionsMock.filter(reaction => reaction._id.includes(reactionsId));
}

class ReactionServiceMock{
    async getReactions(){
        return Promise.resolve(reactionsMock);
    }

    async createReaction(){
        return Promise.resolve(reactionsMock[0]);
    }
}

module.exports = {
    reactionsMock,
    filteredReactionsMock,
    ReactionServiceMock,
}