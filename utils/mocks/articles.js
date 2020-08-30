const articlesMock = [
    {
        "_id": "5f449d36b9d90e0007e06454",
        "phoneOwner": "3019999999",
        "idOwner": "5f449cdeb9d90e0007e06453",
        "type": "Calzado",
        "size": "M",
        "name": "Linda blusa",
        "brand": "Nike",
        "condition": "Nueva",
        "gender": "female",
        "description": "Beautiful blouse",
        "color": "Blanca",
        "date": "2020-08-23 23:33",
        "urlPhoto": "https://www.moneycrashers.com/wp-content/uploads/2019/01/organize-clothes-clean-out-closet.jpg",
        "city": "Medellin"
    },
    {
        "_id": "5f44bee92974740008ca0d28",
        "city": "Obando",
        "type": "Calzado",
        "gender": "Hombre",
        "description": "solo 1 zapato",
        "brand": "Bosi",
        "size": "L",
        "name": "ZApato",
        "color": "Negro",
        "condition": "Nuevo",
        "date": "2020-08-23 23:33",
        "urlPhoto": "https://image.freepik.com/vector-gratis/dibujo-coloreado-ropa-accesorios-mujer-sobre-fondo-blanco_7130-514.jpg",
        "phoneOwner": "3203889058",
        "idOwner": "5f44aed1e88cf100081b6814"
    },
    {
        "_id": "5f45a45fd9de4600086f369f",
        "city": "Soacha",
        "type": "Camisetas",
        "gender": "Hombre",
        "description": "Camisa morada",
        "brand": "Argon",
        "size": "M",
        "name": "Camisa Morada",
        "color": "Morada",
        "condition": "Usado",
        "date": "2020-08-23 23:33",
        "urlPhoto": "https://st.depositphotos.com/1177973/3041/i/450/depositphotos_30413835-stock-photo-beautiful-girl-with-lots-clothes.jpg",
        "phoneOwner": "3203889058",
        "idOwner": "5f44aed1e88cf100081b6814"
    },
    {
        "_id": "5f45ac70de438200074ea0f4",
        "city": "Buga",
        "type": "Pantalones",
        "gender": "Hombre",
        "description": "Juan1234",
        "brand": "Juan1234",
        "size": "Juan1234",
        "name": "Juan1234",
        "color": "Juan1234",
        "condition": "Nuevo",
        "date": "2020-08-23 23:33",
        "urlPhoto": "https://e.rpp-noticias.io/xlarge/2017/01/30/460146_336787.png",
        "phoneOwner": "3203889058",
        "idOwner": "5f44aed1e88cf100081b6814"
    }
];

function filteredArticlesMock(articleId){
    return articlesMock.filter(article => article._id.includes(articleId));
}

function filteredArticleswithReactionMock(phoneOwner){
    return articlesMock.filter(article => article.phoneOwner !== phoneOwner);
}

class ArticlesServiceMock{
    async getArticles(){
        return Promise.resolve(articlesMock);
    }

    async createArticles(){
        return Promise.resolve(articlesMock[0]);
    }
}

module.exports = {
    articlesMock,
    filteredArticlesMock,
    filteredArticleswithReactionMock,
    ArticlesServiceMock,
}