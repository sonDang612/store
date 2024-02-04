/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
class APIFeatures {
  constructor(public query: any, public queryString: any) {}

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj, null, {
      skipMiddleware: true,
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(limitDefault = 8, pageDefault = 1) {
    const page = this.queryString.page * 1 || pageDefault;
    const limit = this.queryString.limit * 1 || limitDefault;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  populate(populateObject: any) {
    this.query = this.query.populate({
      ...populateObject,
    });
    return this;
  }
}
export default APIFeatures;
