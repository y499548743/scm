<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="month"
      placeholder="选择月"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
    ></el-date-picker>
    <el-button type="primary" @click="onSubmit">查询</el-button>
    <h3>主信息</h3>
    <el-table :data="mainData" stripe style="100%">
      <el-table-column prop="total" label="入库单据数">
        <template slot-scope="scope">
          <span>{{scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalNum" label="产品总数量">
        <template slot-scope="scope">
          <span>{{scope.row.totalNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productTotal" label="产品总金额">
        <template slot-scope="scope">
          <span>{{scope.row.productTotal}}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>明细信息</h3>
    <el-table :data="detailData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poId" label="采购单号">
        <template slot-scope="scope">
          <span>{{scope.row.poId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockTime" label="入库日期">
        <template slot-scope="scope">
          <span>{{scope.row.stockTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号">
        <template slot-scope="scope">
          <span>{{scope.row.productCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockNum" label="产品数">
        <template slot-scope="scope">
          <span>{{scope.row.stockNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productTotal" label="产品总金额">
        <template slot-scope="scope">
          <span>{{scope.row.productTotal}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="this.result.total"
      layout="prev, pager, next"
      @current-change="goPage"
      :current-page="currPage"
    ></el-pagination>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
export default {
  data() {
    return {
      dateValue: "",
      mainData: [],
      detailData: [],
      currPage: 1,
      result: ""
    };
  },
  methods: {
    onSubmit() {
      let date = this.dateValue;
      console.log(date);
      requestGet("/api/main/report/instock/main", { time: date }).then(resp => {
        let res = resp.data;
        console.log(res);
        this.mainData.length = 0;
        this.mainData.push(res);
        console.log(this.mainData);
        this.result = res.details;
        this.detailData = res.details.list;
        console.log(this.detailData);
      });
    },
    goPage(page) {
      let date = this.dateValue;
      this.currPage = page;
      requestGet("/api/main/report/instock/main", {
        time: date,
        page: page
      }).then(resp => {
        let res = resp.data;
        this.result = res.details;
        this.detailData = res.details.list;
      });
    }
  }
};
</script>
<style scoped>
.vcipt {
  width: 217px;
}
h3 {
  text-align: center;
  margin: 10px 0 10px 0;
}
</style>