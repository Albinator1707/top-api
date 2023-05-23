import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipe/id-validation.pipe';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto): Promise<CreateTopPageDto> {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(
		@Param('id', IdValidationPipe) id: string,
	): Promise<CreateTopPageDto | null> {
		const page = await this.topPageService.findById(id);
		if (!page) throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const deletedPage = await this.topPageService.deleteById(id);
		if (!deletedPage) throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
	}

	@Get('byAlias/:id')
	async getByAlias(@Param('alias') alias: string) {
		const updatedPage = await this.topPageService.findByAlias(alias);
		if (!updatedPage) throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		return updatedPage;
	}

	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTopPageDto,
	) {
		const updatedPage = await this.topPageService.updateById(id, dto);
		if (!updatedPage) throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}
