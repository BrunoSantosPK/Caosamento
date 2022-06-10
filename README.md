# Cãosamento
*Encontre a companhia perfeita para seu PET*

## Sobre o projeto
O Cãosamento é um sistema que busca prover uma arquietura facilidade para donos de PETs conseguirem encontrar parceiros para a cruza. A partir dele, fica fácil buscar e consultar as opções disponíveis, criando um ecossistema colaborativo.

## Composição
O Cãosamento possui duas partes, a API (este reposítório) e a aplicação mobile Android (disponível [aqui](https://github.com/BrunoSantosPK/CaosamentoApp)). A API é responsável por permitir a gestão de informações no banco de dados, bem como garantir autenticação dos usuários e segurança da informação.

Para lidar com usuários, atualmente foi adotado o Firebase, que permite grande tração nesta tarefa. Já para o armazenamento foi adotado o MongoDB, permitindo alta escalabilidade nos documentos de agendamento, bem como flexibilidade para implementações de features e informações que podem ser geradas pelos usuários.

## Rotas
O arquivo `routes.ts` concentra todas as rotas da API, prezando pela legibilidade semântica. Por se tratar de uma API REST, utiliza JSON para transferir arquivos, de modo que as validações dos corpos enviados nas requisições foram previamente definidas no diretório `validators`. Algumas rotas necessitam de uma validação de autenticação, realizada por um middleware express criado especialmente para este fim (`AuthController`).

A validação requer sempre o envio de duas informações no `headers`:
- token: JWT recuperado via `/login`
- uid: Identificador do usuário recuperado via `/login`

### Gerenciamento de arquivos

**`GET /static/:name`**: Responsável por servir arquivos estáticos, como as fotos de perfil para cada PET cadastrado.
- name: Identificador com o nome do arquivo a ser recuperado

### Gerenciamento de usuários

**`POST /login`**: Responsável por prover a autenticação de um usuário. Recebe no corpo:
- email: E-mail do usuário cadastrado no sistema
- pass: Senha do usuário informado

**`POST /user`**: Responsável por cadastrar um novo usuário no sistema. Recebe no corpo:
- email: E-mail do usuário cadastrado no sistema
- pass: Senha do usuário informado
- repeatPass: Repetição da senha para redundância

**`GET /user/:uid`**: Recupera dados pessoas de um usuário. Necessita do `header` de autenticação.
- uid: Identificador do usuário recuperado via `/login`

**`PUT /user`**: Responsável por adicionar dados pessoais ao usuário. Necessita do `header` de autenticação. Recebe no corpo:
- name: Texto com o nome do usuário
- uf: Sigla do estado do usuário
- city: Nome da cidade do usuário
- uid: Identificador do usuário recuperado via `/login`
- shareWhatsapp: Valor boolean que informa se o usuário deseja compartilhar número de telefone como contato
- whatsapp: Texto com o número do telefone (DDD + número)

**`POST /pass`**: Responsável por fazer o reset de senha, em caso de esquecimento. Um e-mail é enviado para o usuário, via Firebase, onde poderá fazer a troca por uma nova senha. Necessita do `header` de autenticação. Recebe no corpo:
- email: E-mail do usuário cadastrado no sistema

**`PUT /pass`**: Responsável por alterar a senha atual. Necessita do `header` de autenticação. Recebe no corpo:
- email: E-mail do usuário cadastrado no sistema
- oldPass: Senha atual do usuário informado
- pass: Senha nova para ser utilizada
- repeatPass: Repetição da senha para redundância

### Gerenciamento de PETs

**`GET /breed`**: Responsável por retornar todas as raças cadastradas no sistema. Necessita do `header` de autenticação

**`POST /breed`**: Responsável por cadastrar uma nova raça no sistema. Necessita do `header` de autenticação. Recebe no corpo:
- name: Texto com o nome da nova raça
- animal: Identificador do tipo de animal a ser atribuído (dog, cat, etc)

**`GET /animal`**: Responsável por fazer a busca de PETs de acordo com os filtros passados. Necessita do `header` de autenticação. Possui como query param:
- page: Número para referenciar a página que será retornada
- breed: Identificador da raça, obtido por meio da rota `/breed`
- uid: Identificador do usuário recuperado via `/login`
- uf: Sigla do estado para buscar o animal
- city: Nome da cidade para buscar o animal

**`GET /animal/:uid`**: Responsável por recuperar todos os PETs de um usuário. Necessita do `header` de autenticação.
- uid: Identificador do usuário recuperado via `/login`

**`POST /animal`**: Responsável por cadastrar um novo PET para um usuário. Necessita do `header` de autenticação. Utiliza form-data e recebe os campos:
- uid: Identificador do usuário recuperado via `/login`
- name: Texto com o nome atribuído ao PET
- description: Texto com breve descrição sobre o PET
- breed: Identificador da raça, obtido por meio da rota `/breed`
- photo: Arquivo de imagem para caracterizar o PET

**`DELETE /animal`**: Responsável por deletar um registro de PET no sistema. Necessita do `header` de autenticação. Recebe no corpo:
- uid: Identificador do usuário recuperado via `/login`