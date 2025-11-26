// Array para envio dos meus cards iniciais ao servidor
const myCards = [
  {
    place: 'Japão, Monte Fuji',
    link: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    place: 'Portugal, Porto',
    link: 'https://images.unsplash.com/photo-1582647161018-bbf9819c30b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    place: 'Itália, Matera',
    link: 'https://images.unsplash.com/photo-1528214096798-37891d32174c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    place: 'Filipinas, El Nido',
    link: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    place: 'Noruega, Lofoten',
    link: 'https://images.unsplash.com/photo-1593291619462-e4240344ea21?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    place: 'Suécia, Kiruna',
    link: 'https://images.unsplash.com/photo-1581361054863-3edb8d2a1afe?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

// Configs para prefixos dos forms edt, add, photo, register e login
const configEdt = {
  formClassPrefix: 'edt',
};

const configAdd = {
  formClassPrefix: 'add',
};

const configPhoto = {
  formClassPrefix: 'photo',
};

const configRegister = {
  formClassPrefix: 'register',
};

const configLogin = {
  formClassPrefix: 'login',
};

export {
  myCards,
  configEdt,
  configAdd,
  configPhoto,
  configRegister,
  configLogin,
};
