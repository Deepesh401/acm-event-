export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    ['page', 'sort', 'limit', 'fields', 'search'].forEach((key) => delete queryObj[key]);

    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key] === '') delete queryObj[key];
    });

    this.query = this.query.find(queryObj);
    return this;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort?.split(',').join(' ') || '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}
