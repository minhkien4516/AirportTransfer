import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterJourneyDTO } from '../dtos/journey.dto';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {
  private readonly logger = new Logger('JourneysController');
  constructor(private journeysService: JourneysService) {}

  @MessagePattern('register_journey')
  async postJourney(
    @Payload() registerJourneyDTO: RegisterJourneyDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const { vehicleId, travelTime, stations } = registerJourneyDTO;
    try {
      const journey = await this.journeysService.addJourney(
        vehicleId,
        travelTime,
      );
      const journeyDetails = await this.journeysService.addJourneyDetail(
        journey.id,
        stations,
      );
      return {
        ...journey,
        stations: [...journeyDetails],
        message: 'Register journey successfully!',
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_journeys_by_train')
  async getJourneys(@Payload() trainId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const journeys = await this.journeysService.getJourneysByTrain(trainId);
      const journeysWithDetails = await Promise.all(
        journeys.map(async (journey) => {
          const stations = await this.journeysService.getJourneyDetailsByJourney(
            journey.id,
          );
          return { ...journey, stations };
        }),
      );
      return { journeys: journeysWithDetails };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('activate_journey')
  async activateJourney(
    @Payload() journeyId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const journeys = await this.journeysService.activateJourney(journeyId);
      const journeysWithDetails = await Promise.all(
        journeys.map(async (journey) => {
          const stations = await this.journeysService.getJourneyDetailsByJourney(
            journey.id,
          );
          return { ...journey, stations };
        }),
      );
      return {
        journeys: journeysWithDetails,
        message: 'Activate journey successfully',
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('deactivate_journey')
  async deactivateJourney(
    @Payload() journeyId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const journeys = await this.journeysService.deactivateJourney(journeyId);
      const journeysWithDetails = await Promise.all(
        journeys.map(async (journey) => {
          const stations = await this.journeysService.getJourneyDetailsByJourney(
            journey.id,
          );
          return { ...journey, stations };
        }),
      );
      return {
        journeys: journeysWithDetails,
        message: 'Deactivate journey successfully',
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }
}
