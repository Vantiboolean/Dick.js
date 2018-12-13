class Select1 {
  constructor(tableID, recordID, limit, offset, orderby) {
    this.tableID = tableID
    this.recordID = recordID
    this.limit = limit
    this.offset = offset
    this.orderby = orderby
  }

  //查询列表
  select() {
    let query = new wx.BaaS.Query()
    let Record = new wx.BaaS.TableObject(this.tableID)
    return Record.setQuery(query).limit(this.limit).offset(this.offset).orderBy(this.orderby).find().then(res => res.data.objects
      , err => console.error(`Call Failed`)
    )
  }
  //查询单值
  selectA() {
    let Record = new wx.BaaS.TableObject(this.tableID)
    return Record.get(this.recordID).then(res => res.data.ContentDetail.content
      , err => console.error(`Call Failed`)
    )
  }
}

class Select2 {
  constructor(tableID, condition, limit, offset, orderby) {
    this.tableID = tableID
    this.condition = condition
    this.limit = limit
    this.offset = offset
    this.orderby = orderby
  }
  //条件查询
  conditionSelect() {
    let query = new wx.BaaS.Query()
    for (let c in this.condition) {
      query.compare(this.condition[c].condition1, this.condition[c].condition2, this.condition[c].condition3)
    }
    let Record = new wx.BaaS.TableObject(this.tableID)
    return Record.setQuery(query).limit(this.limit).offset(this.offset).orderBy(this.orderby).find().then(res => res.data.objects
      , err => console.error(`Call Failed`)
    )
  }
}
class Insert {
  constructor(tableID, record) {
    this.tableID = tableID
    this.record = record
  }
  //添加记录
  insert(){
    let Record = new wx.BaaS.TableObject(this.tableID)
    let record = Record.create()
    return record.set(this.record).save().then(res => res.data.objects
      , err => console.log('Call Failed')
    )
  }
}
export {
  Select1 as SelectTable,
  Select2 as ConditionSelect,
  Insert as InsertRecord
}
