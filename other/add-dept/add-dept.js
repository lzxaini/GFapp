import {
  showMessage
} from '../../utils/tools';
import {
  getDeptListInfoApi,
  addDeptApi,
  changeTeamInfoApi,
  getRegionApi
} from '../../api/api';

const app = getApp();

Page({
  data: {
    loading: false,
    deptList: [], // 部门列表
    expandedKeys: [], // 展开的节点
    dialogVisible: false, // 对话框显示
    dialogTitle: '新增部门',
    isEdit: false,
    parentDeptName: '',
    deptTypeVisible: false,
    deptTypeText: '', // 部门分类显示文本
    allDeptTypeOptions: [{
        label: '联合创始人',
        value: '1'
      },
      {
        label: '分公司',
        value: '2'
      },
      {
        label: '代理商',
        value: '3'
      },
      {
        label: '门店',
        value: '4'
      }
    ],
    deptTypeOptions: [], // 过滤后的部门分类选项
    form: {
      deptId: undefined,
      parentId: undefined,
      deptName: '',
      deptType: '',
      orderNum: 0,
      phone: '',
      email: '',
      address: '',
      addressKey: '',
      addressDetail: '',
      addressArr: [],
      status: '0'
    },
    parentDeptType: undefined, // 父级部门类型
    cascaderVisible: false, // 省市区选择器
    options: [], // 省市区列表
    cascaderValue: '', // 省市区选中值
    addressValue: '', // 省市区展示文本
    errors: {
      deptName: '',
      deptType: '',
      phone: '',
      email: '',
      address: '',
      addressDetail: ''
    }
  },

  onLoad(options) {
    this.getDeptList();
    this.getRegion();
  },

  // 获取部门列表
  getDeptList() {
    this.setData({
      loading: true
    });
    getDeptListInfoApi().then(res => {
      if (res.code === 200) {
        // 将平级数据转换为树形结构
        const treeData = this.buildTree(res.data);
        this.setData({
          deptList: treeData,
          loading: false
        });
      }
    }).catch(() => {
      this.setData({
        loading: false
      });
      this.message('error', '获取部门列表失败', 2000);
    });
  },

  // 构建树形结构
  buildTree(list) {
    const map = {};
    const result = [];

    // 先创建映射
    list.forEach(item => {
      map[item.deptId] = {
        ...item,
        children: [],
        expanded: false
      };
    });

    // 构建树形关系
    list.forEach(item => {
      const node = map[item.deptId];
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(node);
      } else {
        result.push(node);
      }
    });

    return result;
  },

  // 获取省市区数据
  getRegion() {
    getRegionApi().then(res => {
      const options = res.data || [];
      this.setData({
        options
      });
    }).catch(() => {
      this.message('error', '获取地区数据失败', 2000);
    });
  },

  // 递归查找 label 路径
  findLabelPath(list, code, path = []) {
    for (let item of list) {
      if (item.value === code) {
        return [...path, item.label];
      }
      if (item.children) {
        const result = this.findLabelPath(item.children, code, [...path, item.label]);
        if (result) return result;
      }
    }
    return null;
  },

  // 递归查找部门
  findDeptById(list, deptId) {
    for (let node of list) {
      if (node.deptId == deptId) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findDeptById(node.children, deptId);
        if (found) return found;
      }
    }
    return null;
  },

  // 切换节点展开/折叠
  toggleExpand(e) {
    const {
      deptid
    } = e.currentTarget.dataset;
    const updateNode = (nodes) => {
      for (let node of nodes) {
        if (node.deptId === deptid) {
          node.expanded = !node.expanded;
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (updateNode(node.children)) return true;
        }
      }
      return false;
    };

    const newList = [...this.data.deptList];
    updateNode(newList);
    this.setData({
      deptList: newList
    });
  },

  // 打开新增子部门对话框
  handleAdd(e) {
    const {
      deptid
    } = e.currentTarget.dataset;
    const deptInfo = this.findDeptById(this.data.deptList, deptid);

    if (!deptInfo) {
      this.message('error', '部门信息未找到', 1500);
      return;
    }

    // 根据父部门类型过滤可选的部门分类
    this.filterDeptTypeOptions(deptInfo.deptType);

    this.setData({
      dialogVisible: true,
      dialogTitle: '新增部门',
      isEdit: false,
      parentDeptName: deptInfo.deptName,
      parentDeptType: deptInfo.deptType,
      'form.parentId': deptInfo.deptId,
      'form.deptId': undefined,
      'form.deptName': '',
      'form.deptType': '',
      'form.phone': '',
      'form.email': '',
      'form.address': '',
      'form.addressKey': '',
      'form.addressDetail': '',
      addressValue: '',
      cascaderValue: '',
      deptTypeText: ''
    });
  },

  // 打开修改部门对话框
  handleEdit(e) {
    const {
      deptid
    } = e.currentTarget.dataset;
    const deptInfo = this.findDeptById(this.data.deptList, deptid);

    if (!deptInfo) {
      this.message('error', '部门信息未找到', 1500);
      return;
    }

    const selectedOption = this.data.allDeptTypeOptions.find(item => item.value === deptInfo.deptType);

    // 回显地址
    let addressDisplayValue = '';
    if (deptInfo.addressKey && this.data.options.length > 0) {
      const labelPath = this.findLabelPath(this.data.options, deptInfo.addressKey);
      if (labelPath) {
        addressDisplayValue = labelPath.join('/');
      }
    }

    this.setData({
      dialogVisible: true,
      dialogTitle: '修改部门',
      isEdit: true,
      form: {
        deptId: deptInfo.deptId,
        parentId: deptInfo.parentId,
        deptName: deptInfo.deptName,
        deptType: deptInfo.deptType || '',
        orderNum: deptInfo.orderNum || 0,
        phone: deptInfo.phone || '',
        email: deptInfo.email || '',
        address: deptInfo.address || '',
        addressKey: deptInfo.addressKey || '',
        addressDetail: deptInfo.addressDetail || '',
        status: deptInfo.status || '0'
      },
      addressValue: addressDisplayValue,
      cascaderValue: deptInfo.addressKey || '',
      deptTypeText: selectedOption ? selectedOption.label : ''
    });
  },

  // 关闭对话框
  closeDialog() {
    this.setData({
      dialogVisible: false,
      errors: {
        deptName: '',
        deptType: '',
        phone: '',
        email: ''
      }
    });
  },

  // 根据父部门类型过滤可选的部门分类
  filterDeptTypeOptions(parentDeptType) {
    // 只能选择比父部门类型大的分类（参考 Vue 版本的逻辑）
    const filteredOptions = this.data.allDeptTypeOptions.filter(item => {
      return Number(item.value) > Number(parentDeptType);
    });

    this.setData({
      deptTypeOptions: filteredOptions
    });
  },

  // 部门名称输入
  onDeptNameInput(e) {
    this.setData({
      'form.deptName': e.detail.value,
      'errors.deptName': ''
    });
  },

  // 部门分类选择
  onDeptTypeChange(e) {
    const {
      value,
      label
    } = e.detail;
    this.setData({
      'form.deptType': value[0],
      deptTypeText: label[0],
      deptTypeVisible: false
    });
  },

  // 打开选择器
  onPickerOpen(e) {
    const {
      type
    } = e.currentTarget.dataset;
    if (type === 'deptType') {
      this.setData({
        deptTypeVisible: true
      });
    }
  },

  // 取消选择器
  onPickerCancel() {
    this.setData({
      deptTypeVisible: false
    });
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      'form.phone': e.detail.value,
      'errors.phone': ''
    });
  },

  // 邮箱输入
  onEmailInput(e) {
    this.setData({
      'form.email': e.detail.value,
      'errors.email': ''
    });
  },

  // 详细地址输入
  onAddressDetailInput(e) {
    this.setData({
      'form.addressDetail': e.detail.value,
      'errors.addressDetail': ''
    });
  },

  // 显示省市区选择器
  showCascader() {
    this.setData({
      cascaderVisible: true
    });
  },

  // 省市区选择变化
  onCascaderChange(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    this.setData({
      'form.address': selectedOptions.map((item) => item.label).join('/'),
      'form.addressKey': value,
      addressValue: selectedOptions.map((item) => item.label).join('/'),
      cascaderValue: value,
      'errors.address': '',
      cascaderVisible: false
    });
  },

  // 表单验证
  validate() {
    const {
      form,
      isEdit
    } = this.data;
    let errors = {
      deptName: '',
      deptType: '',
      phone: '',
      email: '',
      address: '',
      addressDetail: ''
    };
    let isValid = true;

    if (!form.deptName || form.deptName.trim() === '') {
      errors.deptName = '部门名称不能为空';
      isValid = false;
    }

    if (!isEdit && !form.deptType) {
      errors.deptType = '部门分类不能为空';
      isValid = false;
    }

    if (form.phone && !/^1[3-9]\d{9}$/.test(form.phone)) {
      errors.phone = '请输入正确的手机号码';
      isValid = false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = '请输入正确的邮箱地址';
      isValid = false;
    }

    if (!form.address || !form.addressKey) {
      errors.address = '请选择地址';
      isValid = false;
    }

    this.setData({
      errors
    });

    if (!isValid) {
      const firstError = errors.deptName || errors.deptType || errors.phone || errors.email || errors.address;
      this.message('error', firstError, 2000);
    }

    return isValid;
  },

  // 提交表单
  onSubmit() {
    if (!this.validate()) {
      return;
    }

    const {
      form,
      isEdit
    } = this.data;
    const submitData = {
      ...form
    };

    wx.showLoading({
      title: isEdit ? '修改中...' : '提交中...',
      mask: true
    });

    // 根据 isEdit 区分调用不同的 API
    const apiCall = isEdit ? changeTeamInfoApi(submitData) : addDeptApi(submitData);

    apiCall.then(res => {
      wx.hideLoading();
      if (res.code === 200) {
        this.message('success', isEdit ? '修改成功' : '新增成功', 1500);
        this.closeDialog();
        this.getDeptList();
      } else {
        this.message('error', res.msg || '操作失败', 2000);
      }
    }).catch(err => {
      wx.hideLoading();
      this.message('error', '操作失败，请重试', 2000);
    });
  },

  // 消息提示
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})