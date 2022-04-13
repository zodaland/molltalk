# MOLLTALK
molltalk은 채팅 웹 어플리케이션 입니다.

* 회원 : 매우 간단한 회원가입과 로그인

* 채팅 : 채팅방 생성을 통한 프라이빗한 환경의 채팅 가능

* 알림 : 채팅방 내 유저 초대 기능과 초대/상태 여부, 입/퇴장 실시간 알림

# SKILLS
BackEnd : `JavaScript`, `Express.js`, `Mongoose`, `MongoDB`, `MySQL`, `WebSocket`, `Jest`

FrontEnd : `JavaScript`, `React`, `Recoil`

# URL
### API
https://api.zodaland.com

### WEB

#### development
https://mt.test.zodaland.com

#### production
https://mt.zodaland.com

# INSTALLATION
* Node version : `v14.16.1 (LTS)`
* Docker version : `20.10.6, build 370c289`
* docker-compose vervison : `1.29.1, build c34c88b2`

git을 통해 clone 합니다.
```git clone https://github.com/zodaland/molltalk.git```

# GETTING STARTED
* yarn version : 1.22.5

## API
### Start with Node.js
1. nodemon 설치
```yarn global add nodemon@latest```

2. 시작 커맨드
```yarn && yarn start```

### Start with Docker, docker-compose
1. docker-compose.yml을 프로젝트 루트에 생성합니다.

docker-compose.yml example
```
version: '3'

services:
  api:
    container_name: molltalk-api
    build:
      context: .
      dockerfile: ./api/Dockerfile
    volumes:
      - ./api:/home/node
    restart: always
  web:
    container_name: molltalk-web
    build:
      context: .
      dockerfile: ./web/Dockerfile
    volumes:
      - ./web:/home/node
    restart: always
```

2. 시작 커맨드
```docker-compose up -d --build```

# API SPECIFICATION
http
/auth
post  /register
post  /login
any  /logout

/room
post / - create
get / - find

/room/
get /user - find
post /user - create
delete /:no/user


/invitation
post / - create
get / - find
delete /:no - delete

/user
any /check - check
get /:id - find

wss

json 데이터를 주고 받는다.
json schema

필수 데이터 type: string

type
JOIN
 no - 방번호
SEND
 content - 내용
INVITE
 no - 초대 받을 유저 번호
EXIT

ROOMENTER
 no - 방번호
ROOMEXIT
 no - 방번호
HEART
 no - 방번호

# BROWSER SUPPORT
* chrome
* firefox
* sapari
* samsung internet
