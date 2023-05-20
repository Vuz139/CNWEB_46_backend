const { query } = require("../db/database");

class APIFeatures {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	search() {
		const keyword = this.queryStr.keyword
			? {
					name: this.queryStr.keyword.toLowerCase(),
			  }
			: { name: "" };

		let copyQuery = [...this.query];
		for (let i = 0; i < copyQuery.length; i++) {
			if (
				!copyQuery[i].name.toLowerCase().includes(keyword.name) &&
				!copyQuery[i].category.toLowerCase().includes(keyword.name) &&
				!copyQuery[i].seller.toLowerCase().includes(keyword.name)
			) {
				copyQuery.splice(i, 1);
				i--;
			}
		}
		this.query = copyQuery;
		return this;
	}

	filter() {
		const queryCopy = { ...this.queryStr };
		console.log("queryCopy", queryCopy);
		// Removing fields from the query
		const removeFields = ["keyword", "limit", "page"];
		removeFields.forEach((param) => delete queryCopy[param]);
		let copyQuery = [...this.query];
		// console.log(copyQuery);

		for (let index = 0; index < copyQuery.length; index++) {
			for (const key in queryCopy) {
				let check = true;
				if (queryCopy[key].gte) {
					check =
						check &&
						Number(copyQuery[index][key]) >=
							Number(queryCopy[key].gte);
				} else if (queryCopy[key].lte) {
					check =
						check &&
						Number(copyQuery[index][key]) <=
							Number(queryCopy[key].lte);
				} else if (queryCopy[key].gt) {
					check =
						check &&
						Number(copyQuery[index][key]) >
							Number(queryCopy[key].gt);
				} else if (queryCopy[key].lt) {
					check =
						check &&
						Number(copyQuery[index][key]) <
							Number(queryCopy[key].lt);
				}
				if (!check) {
					copyQuery.splice(index, 1);
					index--;
				}
			}
		}

		this.query = copyQuery;
		return this;
	}

	pagination(resPerPage) {
		const currentPage = Number(this.queryStr.page) || 1;
		const skip = resPerPage * (currentPage - 1);
		let copyQuery = [];
		for (let index = skip; index < skip + resPerPage; index++) {
			this.query[index] && copyQuery.push(this.query[index]);
		}
		this.query = copyQuery;

		return this;
	}
}

module.exports = APIFeatures;
