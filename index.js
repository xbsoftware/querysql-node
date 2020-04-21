function getSQL(data, config){
	config = config || {};
	if(!data.rules){
		if(config.whitelist && !config.whitelist.includes(data.field))
			return { error:`field name is not in whitelist: ${data.field}` };
		if(data.includes && data.includes.length)
			return { sql:`${data.field} IN (${data.includes.map(val => "?").join()})`, values:data.includes };

		let filter = data.condition.filter;
		let type = data.condition.type;

		if((type == "between" || type == "notBetween")){
			if(filter.start === null){
				filter = filter.end;
				type = "between" ? "lessOrEqual" : "greater";
			}
			else if(filter.end === null){
				filter = filter.start;
				type = "between" ? "greaterOrEqual" : "less";
			}
		}

		switch(type){
			case "":
				return { sql:"", values:[] };
			case "equal":
				return { sql:`${data.field} = ?`, values:[filter] };
			case "notEqual":
				return { sql:`${data.field} <> ?`, values:[filter] };
			case "contains":
				return { sql:`INSTR(${data.field}, ?) > 0`, values:[filter] };
			case "notContains":
				return { sql:`INSTR(${data.field}, ?) < 0`, values:[filter] };
			case "lessOrEqual":
				return { sql:`${data.field} <= ?`, values:[filter] };
			case "greaterOrEqual":
				return { sql:`${data.field} >= ?`, values:[filter] };
			case "less":
				return { sql:`${data.field} < ?`, values:[filter] };
			case "greater":
				return { sql:`${data.field} > ?`, values:[filter] };
			case "beginsWith":
				return { sql:`${data.field} LIKE CONCAT(?, '%')`, values:[filter] };
			case "notBeginsWith":
				return { sql:`${data.field} NOT LIKE CONCAT(?, '%')`, values:[filter] };
			case "endsWith":
				return { sql:`${data.field} LIKE CONCAT('%', ?)`, values:[filter] };
			case "notEndsWith":
				return { sql:`${data.field} NOT LIKE CONCAT('%', ?)`, values:[filter] };
			case "between":
				return { sql:`${data.field} BETWEEN ? AND ?`, values:[filter.start, filter.end] };
			case "notBetween":
				return { sql:`${data.field} NOT BETWEEN ? AND ?`, values:[filter.start, filter.end] };
		}

		if(config.operations){
			const operation = config.operations[type];
			if(operation)
				return operation(data.field, filter);
		}

		return { error:`unknown operation: ${type}` };
	}

	let sql = [];
	let values = [];

	for(let i = 0; i < data.rules.length; i++){
		const subSQL = getSQL(data.rules[i], config);
		if(subSQL.error)
			return subSQL;
		sql.push(subSQL.sql);
		values = values.concat(subSQL.values);
	}

	sql = sql.join(` ${data.glue.toUpperCase()} `); 

	if(data.rules.length)
		sql =  `( ${sql} )`;

	return { sql, values };
}

module.exports = getSQL;