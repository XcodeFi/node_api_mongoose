import Tag, { TagModel } from '@/models/tags.model';
import { CreateTagDto } from '@dtos/tags.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class TagService {
  public tags = TagModel;

  public async findAllTag(): Promise<Tag[]> {
    const tags: Tag[] = await this.tags.find({});
    return tags;
  }

  public async findTagById(tagId: string): Promise<Tag> {
    if (isEmpty(tagId)) throw new HttpException(400, "You're not tagId");

    const findTag: Tag = await this.tags.findOne({ _id: tagId });
    if (!findTag) throw new HttpException(409, "You're not tag");

    return findTag;
  }

  public async createTag(tagData: CreateTagDto): Promise<Tag> {
    if (isEmpty(tagData)) throw new HttpException(400, "You're not tagData");

    const findTag: Tag = await this.tags.findOne({ name: tagData.name });
    if (findTag) throw new HttpException(409, `You're tag name ${tagData.name} already exists`);

    const createTagData: Tag = await this.tags.create(tagData);

    return createTagData;
  }

  public async updateTag(tagId: string, tagData: CreateTagDto): Promise<Tag> {
    if (isEmpty(tagData)) throw new HttpException(400, "You're not tagData");

    if (tagData.name) {
      const findTag: Tag = await this.tags.findOne({ name: tagData.name });
      if (findTag && findTag._id != tagId) throw new HttpException(409, `You're tag name ${tagData.name} already exists`);
    }

    const updateTagById: Tag = await this.tags.findByIdAndUpdate(tagId, { tagData });
    if (!updateTagById) throw new HttpException(409, "You're not tag");

    return updateTagById;
  }

  public async deleteTag(tagId: string): Promise<Tag> {
    const deleteTagById: Tag = await this.tags.findByIdAndDelete(tagId);
    if (!deleteTagById) throw new HttpException(409, "You're not tag");

    return deleteTagById;
  }
}

export default TagService;
