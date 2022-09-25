import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { ReadInput } from '../inputs/read.input';
import { RoleGuard } from '../../guards/role.guard';
import { HistoricOutput } from '../outputs/historic.output';
import { HistoricRepositoryService } from '../repository/historic-repository.service';

@Resolver()
export class ReadHistoricResolver {
  constructor(
    private _authService: AuthService,
    private _historicRepo: HistoricRepositoryService,
  ) {}

  @Query(() => HistoricOutput, {
    name: 'item_changes',
    description: "find All changes of one item where id == 'itemId' ",
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async changes(@Args('itemId') getInput: ReadInput, @Context() context) {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const type: string = this._authService.userType(token);
    const id_user = this._authService.userID(token);

    const { itemId, order } = getInput;

    return new Promise<HistoricOutput>((resolve, reject) => {
      if (type == 'basic') {
        this._historicRepo
          .get_historic_one_item({
            itemId,
            order,
            id_user: this._historicRepo.basic_condition(id_user),
          })
          .then(([changes, count]) => resolve({ changes, count }));
      } else {
        this._historicRepo
          .get_historic_one_item({
            itemId,
            order,
            id_user: this._historicRepo.admin_condition(id_user),
          })
          .then(([changes, count]) => resolve({ changes, count }));
      }
    });
  }
}
