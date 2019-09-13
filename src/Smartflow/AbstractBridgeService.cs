﻿using Smartflow.Internals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Smartflow
{
    /// <summary>
    /// 定义与业务系统中基础数据衔接接口
    /// </summary>
    public abstract class AbstractBridgeService
    {
        protected WorkflowProcessService ProcessService
        {
            get
            {
                return WorkflowGlobalServiceProvider.Resolve<WorkflowService>().ProcessService;
            }
        }

        /// <summary>
        /// 获取参与组
        /// </summary>
        /// <returns>组列表</returns>
        public abstract List<WorkflowGroup> GetGroup();

        /// <summary>
        /// 获取参与者列表
        /// </summary>
        /// <param name="pageIndex">页索引</param>
        /// <param name="pageSize"></param>
        /// <param name="total"></param>
        /// <param name="actorIds"></param>
        /// <param name="searchKey"></param>
        /// <returns></returns>
        public abstract List<WorkflowActor> GetActors(int pageIndex, int pageSize, out int total, string actorIDs, string searchKey);

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <returns></returns>
        public List<WorkflowConfiguration> GetSettings()
        {
            return new WorkflowConfigurationService().Query(Utils.Empty).ToList();
        }

        public IList<dynamic> GetRecords(string instanceID)
        {
             return ProcessService.GetRecords(instanceID);
        }


        /// <summary>
        /// 获取当前执行节点的记录
        /// </summary>
        /// <param name="instanceID"></param>
        /// <returns></returns>
        public dynamic GetJumpProcess(string instanceID)
        {
            WorkflowInstance instance = WorkflowInstance.GetInstance(instanceID);
            IList<dynamic> records = this.GetRecords(instanceID);

            return new
            {
                structure = instance.Resource,
                id = instance.Current.ID,
                record = records
            };
        }
    }
}
