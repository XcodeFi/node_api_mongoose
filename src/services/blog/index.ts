import * as blogList from './blogList';
import * as blogEdit from './blogEdit';

export default class BlogServiceNew {}

export class BlogServiceVariable {
  static AUTHOR_DETAIL: 'email profilePicUrl';
  static BLOG_INFO_ADDITIONAL: '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  static BLOG_ALL_DATA: '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';
}
