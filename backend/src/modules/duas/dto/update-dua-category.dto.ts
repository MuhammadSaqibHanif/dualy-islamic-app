import { PartialType } from '@nestjs/swagger';
import { CreateDuaCategoryDto } from './create-dua-category.dto';

export class UpdateDuaCategoryDto extends PartialType(CreateDuaCategoryDto) {}