import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'src/entities/administrator.entity';
import { Events } from 'src/entities/events.entity';
import { Lounges } from 'src/entities/lounges.entity';
import { Photos } from 'src/entities/photos.entity';
import { Reservations } from 'src/entities/reservations.entity';
import { Superadministrator } from 'src/entities/superadministrator.entity';
import { Tables } from 'src/entities/tables.entity';
import { User } from 'src/entities/user.entity';
import { UserToken } from 'src/entities/usertoken.entity';
import { AdministratorController } from './controllers/administrator/administrator.controller';
import { SuperadministratorController } from './controllers/superadministrator/superadministrator.controller';
import { AdministratorService } from './services/administrator/administrator.service';
import { SuperadministratorService } from './services/superadministrator/superadministrator.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.services';
import { AuthController } from './controllers/auth/auth.controller';
import { NestModule } from '@nestjs/common';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotosService } from './services/photos/photos.services';
import { EventsService } from './services/events/events.services';
import { eventsController } from './controllers/events/events.controller';
import { reservationController } from './controllers/reservations/reservation.controller';
import { ReservationsService } from './services/reservations/reservations.services';
import { AdministratorToken } from './entities/administratortoken.entity';
import { Ratings } from './entities/ratings.entity';
import { ratingsController } from './controllers/ratings/ratings.controller';
import { ratingService } from './services/ratings/ratings.services';
import { photosController } from './controllers/photos/photos.controller';
import { Logos } from './entities/logo.entity';
import { LogosService } from './services/logos/logos.services';
import { logosController } from './controllers/logos/logos.controller';
import { SuperadministratorToken } from './entities/superadministrator.token.entity';
import { qrcode } from './entities/qrcode.entity';
import { qrcodeService } from './services/qrcode/qrcode.services';
import { qrcodeController } from './controllers/qrcode/qrcode.controller';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: DatabaseConfiguration.hostname,
      port:3306,
      username:DatabaseConfiguration.username,
      password:DatabaseConfiguration.password,
      database:DatabaseConfiguration.database,
      entities:[ 
      Administrator,
      Events,
      Lounges,
      Photos,
      Reservations,
      Superadministrator,
      Tables,
      User,
      UserToken,
      AdministratorToken,
      SuperadministratorToken,
       Ratings,
      Logos,
    qrcode ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Events,
      Lounges,
      Photos,
      Reservations,
      Tables,
      User,
      Superadministrator,
      UserToken,
      AdministratorToken,
      Ratings,
      Logos,
      SuperadministratorToken,
      qrcode
    ])
  ],
  controllers: [AppController,eventsController,AdministratorController,SuperadministratorController, UserController, AuthController,reservationController,ratingsController,photosController,logosController,qrcodeController],
  providers: [AppService,AdministratorService,SuperadministratorService,UserService,PhotosService, EventsService,ReservationsService,ratingService,LogosService, qrcodeService ],
  exports:[
    AdministratorService,
    UserService,
    SuperadministratorService,
    PhotosService,
    LogosService ,
    qrcodeService
  ]
  })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    .exclude('auth/*')
    .forRoutes('service/*');
  }
}
