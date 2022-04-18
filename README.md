# Mamboo Kanban API

Esta aplicação foi desenvolvida como teste técnico do processo seletivo para a vaga de desenvolvedor backend na empresa Mamboo.

Trata-se de uma API de tarefas de uma aplicação de quadro Kanban com 7 endpoints onde é possível realizar operações CRUD em um banco de dados MongoDB.

Abaixo você encontrará instruções sobre como consultar a documentação da API, como acessar a aplicação, testes da aplicação, tecnologias utilizadas e um diagrama da arquitetura implementada.

## Documentação da API

A documentação de operação da API foi feita utilizando [Swagger](https://swagger.io/) e seguindo a [OAS3 (OpenAPI Specification 3.0)](https://swagger.io/specification/), e pode ser consultada de forma interativa através dos endpoints `/docs/pt` e `/docs/en` em portugues e inglês respectivamente.

Além de explicar e exemplificar a utilização da API, as páginas ainda permitem testar os endpoints diretamente pela interface gráfica da documentação.

## Acessando a aplicação em produção

A aplicação poderá ser acessada através de seu deploy na plataforma `Heroku`. Para isso basta clicar [aqui](https://mamboo-kanban-api.herokuapp.com/docs/pt/).

A aplicação em produção utiliza um banco de dados `MongoDB Atlas` hospedado pela AWS em São Paulo.

## Rodando localmente

A execução da aplicação de forma local pode ser realizada de duas formas: `Docker` ou `Node`.

<details>
  <summary><b>Docker</b></summary><br>

***Para rodar a API localmente utilizando Docker, certifique-se de ter o [Docker](https://docs.docker.com/get-docker/) e o [Docker-Compose](https://docs.docker.com/compose/install/) instalados em sua máquina.***

Obs: Docker e Docker-Compose utilizados no desenvolvimento e execução deste projeto estavam nas versões `20.10.13` e `1.29.2` respectivamente.

1. Clone o projeto

```bash
  git clone git@github.com:GabrielGaspar447/Mamboo-Kanban-API.git
```

2. Entre no diretório do projeto

```bash
  cd Mamboo-Kanban-API
```

3. Suba a orquestração de containers

```bash
  docker-compose up --build -d
```

4. A aplicação estará pronta para uso quando a saída no seu terminal ficar assim

```bash
  Creating mk_db ... done
  Creating mk_api ... done
```

5. A aplicação poderá ser acessada através de

```bash
  http://localhost:3001
```

6. Para encerrar a aplicação basta executar o comando

```bash
  docker-compose down --rmi local --volumes --remove-orphans
```

***Caso a saída no seu terminal após o passo 4 seja um erro contendo a mensagem `Ports are not available`, abra o arquivo docker-compose.yml e siga as instruções para alterar a porta 3001 para outra que esteja disponível em sua máquina. Após realizar a alteração salve o arquivo e execute o passo 4 novamente.***
</details>

<details>
  <summary><b>Node</b></summary><br>

***Para rodar a API localmente utilizando Node, certifique-se de ter o [Node](https://nodejs.org/en/) instalado em sua máquina e um banco de dados [MongoDB](https://www.mongodb.com/) disponível para ser utilizado.***

Obs: Node e MongoDB utilizados no desenvolvimento e execução deste projeto estavam nas versões `16.13.0` e `5.0.7` respectivamente.

1. Clone o projeto

```bash
  git clone git@github.com:GabrielGaspar447/Mamboo-Kanban-API.git
```

2. Entre no diretório do projeto

```bash
  cd Mamboo-Kanban-API
```

3. Instale as dependências

```bash
  npm install
```

4. Configure na raiz da aplicação um arquivo .env com as seguintes variáveis de ambiente

```bash
  PORT=<Porta onde a aplicação irá rodar (Padrão: 3001)>
  MONGO_URI=<URI de acesso ao MongoDB (Padrão: mongodb://localhost:27017/mamboo-kanban-api)>
```

5. Rode a aplicação

```bash
  npm start
```

6. A aplicação estará pronta para uso quando a saída no seu terminal ficar assim

```bash
  Database connection established
  Database seed with 28 random tasks (Aparece apenas na primeira vez)
  Server is running on port <porta utilizada no .env>
```

7. A aplicação poderá ser acessada através de

```bash
  http://localhost:<porta utilizada no .env>
```

8. Para encerrar a aplicação basta pressionar `Ctrl + C` no terminal
</details>

## Testes

Esta aplicação conta com `37 suítes de teste` com mais de `170 testes`, sendo eles unitários e de integração, provendo uma cobertura de `100%` em todos os arquivos testáveis. Este desenvolvimento orientado a testes combinado aos `git hooks` utlizando [Husky](https://github.com/typicode/husky), integração contínua (CI) utilizando `GitHub Actions` e entrega contínua (CD) utilizando o `GitHub Integration` do [Heroku](https://devcenter.heroku.com/articles/github-integration) garantem alta confiabilidade no deploy desta API para produção.

***Obs: No decorrer do desenvolvimento desta aplicação a entrega contínua (CD) foi interrompida devido uma brecha de segurança na integração entre as plataformas `Heroku` e `GitHub` (mais detalhes [aqui](https://status.heroku.com/incidents/2413)). O deploy da aplicação continuou sendo realizado através do Heroku CLI e a confiabilidade se manteve através dos `git hooks`.***

  <details>
  <summary><b>Rodando os testes</b></summary><br>
    
***Para rodar os testes, certifique-se de ter o [Node](https://nodejs.org/en/) instalado em sua máquina. Não é necessário um banco de dados [MongoDB](https://www.mongodb.com/) disponível, os testes de integração são executados utilizando [MongoDB-Memory-Server](https://github.com/nodkz/mongodb-memory-server).***

Obs: Node utilizado no desenvolvimento e execução dos testes deste projeto estava na versão `16.13.0`.

1. Clone o projeto

```bash
  git clone git@github.com:GabrielGaspar447/Mamboo-Kanban-API.git
```

2. Entre no diretório do projeto

```bash
  cd Mamboo-Kanban-API
```

3. Instale as dependências

```bash
  npm install
```

5. Rode os testes

```bash
  npm test
```
</details>

## Arquitetura

![Diagrama da arquitetura](/architecture.png "Diagrama da arquitetura")

## Conhecimentos aplicados

### Stacks e bibliotecas principais

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Docker
- Jest
- Swagger
- ESLint

### Paradigmas

- TDD
- REST
- OOP
- SOLID
- CI/CD

### Outras bibliotecas

- Dotenv
- Express-Async-Errors
- Joi
- Mongoose-Paginate-V2
- MongoDB-Memory-Server
- Supertest
- Husky
- Lint-Staged
- Git-Commit-Msg-Linter
