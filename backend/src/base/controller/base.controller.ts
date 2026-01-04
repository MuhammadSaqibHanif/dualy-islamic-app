import { Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BaseService } from '../service/base.service';
import { BaseEntity } from '../entity/base.entity';

export abstract class BaseController<
  T extends BaseEntity,
  CreateDto = any,
  UpdateDto = any,
> {
  protected abstract service: BaseService<T>;

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page || limit) {
      return this.service.findAllPaginated({}, { page, limit });
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string) {
    return this.service.findByIdOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  @ApiResponse({ status: 201, description: 'Item created' })
  async create(@Body() createDto: CreateDto) {
    return this.service.create(createDto as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.service.update(id, updateDto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item (soft delete)' })
  @ApiResponse({ status: 200, description: 'Item deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Item deleted successfully' };
  }
}