import styles from './index.css';

import React, {Component} from 'react';
import {Button, Input, message, Select, Table, Spin} from 'antd';
// 组件
import CodeEditor from '../components/CodeEditor.js'

const {Option} = Select;

// 匹配出function name
function getFuncName(str) {
  if (str.trim() === '') {
    return message.error('运行代码为空')
  }
  const pattern = /(?<=function).*?(?=\()/;
  const obj = str.match(pattern);
  if (!obj) {
    return message.error('运行代码格式有误');
  }
  return str.match(pattern)[0].trim()
}

// 匹配出输入、输出参数
function getParams(str) {
  if (str.trim() === '') {
    return false
  }
  let reg = new RegExp("<parameter>([\\s\\S]*)</parameter>");
  let params = reg.exec(str);
  if (!params) {
    return false
  }
  return JSON.parse(params[1])
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeValue: '',
      inputs: [],
      nowExecuteTime: 0,
      tableData: [],
      loading: false
    };
  }

  // didmount加载数据
  componentDidMount() {
  }

  // 改变的回调
  handleValueChange = (val) => {
    this.setState({
      codeValue: val
    }, () => {
      // console.log(this.state.codeValue);
    })
  };

  handleInputChange = (val, index) => {
    console.log(val);
    const arr = [...this.state.inputs];
    arr[index]['value'] = val;
    this.setState({
      inputs: arr
    })
  };

  // 获取当前脚本的输入框dom
  getInputsDom = () => {
    return this.state.inputs.map((item, index) => {
      return (
        <div className={styles.inputRow} key={index}>
          <div className={styles.inputBox}>
            <span>{item['name']}：</span>
            <Input onChange={(e) => {
              this.handleInputChange(e.target.value, index)
            }} style={{width: '300px'}}
                   value={item['dataType'] === 'Number' ? Number(item['value']) : item['value'].toString()}
                   placeholder="Basic usage"/>
          </div>
          <div className={styles.inputBox}>
            <span>类型：</span>
            <Select value={item['dataType']} style={{width: 200}} onChange={this.handleChange}>
              <Option value="Number">Number</Option>
              <Option value="String">String</Option>
            </Select>
          </div>
        </div>
      )
    });
  }

  // 解析出来参数
  importParams = () => {
    const originCode = this.state.codeValue;
    const params = getParams(originCode);
    if (params === false) {
      return message.error('运行代码格式有误');
    }
    this.setState({
      inputs: params['inputs']
    });
  };

  // 点击执行脚本
  executeCode = () => {
    if (this.state.inputs.length === 0) {
      return message.error('请先点击导入参数，并设置测试值')
    }
    this.setState({
      loading: true
    }, () => {
      setTimeout(() => {
        this.excutingCode()
      }, 200)
    });
  };

  // 执行
  excutingCode = () => {
    const originCode = this.state.codeValue;
    const funcName = getFuncName(originCode);

    // 拼接执行代码
    const inputsStr = this.state.inputs.map(item => {
      return item['dataType'] === 'Number' ? Number(item.value) : `'${item.value}'`
    }).join(',');

    const resCode = `${originCode};${funcName}(${inputsStr})`;

    const func = new Function(resCode);
    const timeArray = this.getExecuteTime(func);
    console.log(timeArray);
    const obj = {
      name: 'funcName',
      ExecuteTime1: timeArray[0],
      ExecuteTime2: timeArray[1],
      dateStr: new Date().getTime()
    };
    const {tableData} = this.state;
    let newTableData = [...tableData];
    newTableData.push(obj);
    this.setState({
      tableData: newTableData,
    })
    this.setState({
      loading: false
    })
  }

  getExecuteTime = (func) => {
    const arr = [];
    let start = new Date().getTime();
    for (let i = 0; i < 1000; i++) {
      // 这个if语句的条件和执行体是随便写的，目的是让程序尽可能多运算一点时间，得到一个相对大的时间差
      if (i === 100) {
        let end1 = new Date().getTime();
        arr.push(end1 - start)
      }
      func();
    }
    let end2 = new Date().getTime();
    // console.log(end2 - start);
    arr.push(end2 - start);
    return arr
  };

  // 下拉框回调
  handleChange = (val) => {
    console.log(val);
  }


  render() {
    const columns = [
      {
        title: '函数名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '100次执行耗时(ms)',
        dataIndex: 'ExecuteTime1',
        key: 'ExecuteTime1',
      },
      {
        title: '10000次执行耗时(ms)',
        dataIndex: 'ExecuteTime2',
        key: 'ExecuteTime2',
      },
      {
        title: '日期',
        dataIndex: 'dateStr',
        key: 'dateStr',
      }
    ];
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <CodeEditor value={this.state.codeValue} handleValueChange={this.handleValueChange}/>
          <div className={styles.bottomRow}>
            <div style={{width: '50%', maxHeight: 'calc(100vh - 500px)', overflowY: 'auto', overflowX: 'hidden'}}>
              <Table rowKey={'dateStr'} style={{width: '100%'}} columns={columns} dataSource={this.state.tableData}
                     pagination={false}/>
            </div>
            <div>
              {this.getInputsDom()}
              <p style={{fontSize: '20px', padding: '20px 30px'}}>
                执行耗时: {this.state.nowExecuteTime}ms
              </p>
              <Button style={{position: 'fixed', bottom: '100px', right: '50px'}} type="primary"
                      onClick={this.importParams}>
                导入参数
              </Button>
              <Button style={{position: 'fixed', bottom: '50px', right: '50px'}} className={styles.fixedBtn}
                      type="primary" onClick={this.executeCode}>
                执行脚本
              </Button>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Index;
