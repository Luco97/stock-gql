import { Args, Query, Resolver } from '@nestjs/graphql';
import { ItemEntity } from '../model/item-entity';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { ReadInput } from '../inputs/read.input';

@Resolver(() => ItemEntity)
export class GetItemsResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Query(() => [ItemEntity])
  async getItems(
    @Args('paginate', { nullable: true }) getInput: ReadInput,
  ): Promise<ItemEntity[]> {
    return await this._itemService.itemRepo.find({
      take: getInput?.take,
      skip: getInput?.skip,
    });
  }
}
