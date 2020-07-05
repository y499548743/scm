<template>
  <el-container>
    <el-header>
      <span>信息管理系统界面</span>
      <span>
        <span>
          <i class="el-icon-user-solid">{{user.account}}</i>
          <i class="el-icon-time"></i>
          系统时间：{{now}}
        </span>
      </span>
    </el-header>
    <p class="mid">
      <span class="menu">菜单管理</span>
      <span class="place">位置:ㅤ</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$route.meta.tag}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          router
          text-color="#111"
          background-color="#D4E7F0"
          active-text-color="#fff"
          :unique-opened="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>管理信息
            </template>
            <el-menu-item index="/welcome">
              <i class="el-icon-caret-right"></i>首页
            </el-menu-item>
            <el-menu-item index="/user/manager">
              <i class="el-icon-caret-right"></i>用户管理
            </el-menu-item>
            <el-menu-item index @click="changeLoginDialogVisible=true">
              <i class="el-icon-caret-right"></i>重新登录
            </el-menu-item>
            <el-menu-item index @click="exitDialogVisible = true">
              <i class="el-icon-caret-right"></i>退出系统
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>采购管理
            </template>
            <el-menu-item index="/purchase/suppliermanager">
              <i class="el-icon-caret-right"></i>供应商管理
            </el-menu-item>
            <el-menu-item index="/purchase/pomainmanager">
              <i class="el-icon-caret-right"></i>新添采购单
            </el-menu-item>
            <el-menu-item index="/purchase/endpomain">
              <i class="el-icon-caret-right"></i>采购单了结
            </el-menu-item>
            <el-menu-item index="/purchase/searchpomain">
              <i class="el-icon-caret-right"></i>采购单查询
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i>仓储管理
            </template>
            <el-menu-item index="/stock/instock">
              <i class="el-icon-caret-right"></i>入库登记
            </el-menu-item>
            <el-menu-item index="/stock/outstock">
              <i class="el-icon-caret-right"></i>出库登记
            </el-menu-item>
            <el-menu-item index="/stock/checkstock">
              <i class="el-icon-caret-right"></i>库存盘点
            </el-menu-item>
            <el-menu-item index="/stock/querystock">
              <i class="el-icon-caret-right"></i>库存查询
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>财务收支
            </template>
            <el-menu-item index="/finance/receipt">
              <i class="el-icon-caret-right"></i>收款登记
            </el-menu-item>
            <el-menu-item index="/finance/pay">
              <i class="el-icon-caret-right"></i>付款登记
            </el-menu-item>
            <el-menu-item index="/finance/query">
              <i class="el-icon-caret-right"></i>收支查询
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-document"></i>销售管理
            </template>
            <el-menu-item index="/sell/categorymanager">
              <i class="el-icon-caret-right"></i>产品分类管理
            </el-menu-item>
            <el-menu-item index="/sell/productmanager">
              <i class="el-icon-caret-right"></i>产品管理
            </el-menu-item>
            <el-menu-item index="/sell/customermanager">
              <i class="el-icon-caret-right"></i>客户管理
            </el-menu-item>
            <el-menu-item index="/sell/somainmanager">
              <i class="el-icon-caret-right"></i>新添销售单
            </el-menu-item>
            <el-menu-item index="/sell/endsomain">
              <i class="el-icon-caret-right"></i>销售单了结
            </el-menu-item>
            <el-menu-item index="/sell/searchsomain">
              <i class="el-icon-caret-right"></i>销售单查询
            </el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-document"></i>业务报表
            </template>
            <el-menu-item index="/chart/purchasechart">
              <i class="el-icon-caret-right"></i>月度采购报表
            </el-menu-item>
            <el-menu-item index="/chart/financechart">
              <i class="el-icon-caret-right"></i>月度收支登记表
            </el-menu-item>
            <el-menu-item index="/chart/instockchart">
              <i class="el-icon-caret-right"></i>月度入库报表
            </el-menu-item>
            <el-menu-item index="/chart/outstockchart">
              <i class="el-icon-caret-right"></i>月度出库报表
            </el-menu-item>
            <el-menu-item index="/chart/stockchart">
              <i class="el-icon-caret-right"></i>月度库存报表
            </el-menu-item>
            <el-menu-item index="/chart/sellchart">
              <i class="el-icon-caret-right"></i>月度销售报表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-document"></i>网上销售
            </template>
            <el-menu-item index="7-1">
              <i class="el-icon-caret-right"></i>客户注册
            </el-menu-item>
            <el-menu-item index="7-2">
              <i class="el-icon-caret-right"></i>商品展示
            </el-menu-item>
            <el-menu-item index="7-3">
              <i class="el-icon-caret-right"></i>网上下单
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-dialog title="提示" :visible.sync="exitDialogVisible" width="30%">
      <span>是否继续退出应用程序</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="changeLoginDialogVisible" width="30%">
      <span>是否更换登录用户</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeLoginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeLogin">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      now: new Date().toLocaleString(),
      exitDialogVisible: false,
      changeLoginDialogVisible: false
    };
  },
  computed: {
    ...mapState(["user"])
  },
  mounted() {
    let _this = this;
    this.timer = setInterval(() => {
      _this.now = new Date().toLocaleString();
    }, 1000);
  },
  methods: {
    exit() {
      this.exitDialogVisible = false;
      window.location.href = "about:blank";
      window.close();
    },
    changeLogin() {
      this.changeLoginDialogVisible = false;
      this.$router.push("/");
    }
  }
};
</script>

<style>
.el-header {
  height: 88px !important;
  background-color: #066cac;
  line-height: 88px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
}
.el-header span:nth-child(2) span {
  font-size: 14px;
  border-radius: 5%;
  background-color: #045381;
  padding: 5px 20px 5px 20px;
  border-radius: 15px;
}
.el-aside {
  background-color: #f0f9fd;
}
.mid {
  height: 40px;
  background-color: #edf6fa;
}
.mid span {
  display: block;
  float: left;
}
.menu {
  background-color: #3a94c8;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #fff;
  width: 200px;
}
.place {
  height: 40px;
  background-color: #edf6fa;
  line-height: 40px;
  font-size: 14px;
  text-indent: 10px;
  font-weight: bold;
}
.mid .el-breadcrumb{
  line-height: 40px;
}
/* .el-main {
  padding: 0;
} */
.el-menu-item,
.el-submenu__title {
  height: 35px;
  line-height: 30px;
  font-size: 12px;
}
.el-submenu .el-menu-item {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.el-container .el-container {
  height: 537px;
}
</style>