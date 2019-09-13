﻿using Smartflow.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Smartflow
{
    public class DefaultActionService : IWorkflowAction
    {
        public IWorkflowAction Scan(string name)
        {
            return WorkflowActionFactory
                      .Actions
                      .FirstOrDefault(entry =>string.Equals(entry.GetType().FullName,name,StringComparison.OrdinalIgnoreCase));
        }

        public void ActionExecute(ExecutingContext executingContext)
        {
            IList<IWorkflowAction> actions = GetWorkflowActions(executingContext.To);

            foreach (IWorkflowAction action in actions)
            {
                action.ActionExecute(executingContext);
            }
        }

        private List<IWorkflowAction> GetWorkflowActions(Node to)
        {
            List<IWorkflowAction> partAction = new List<IWorkflowAction>();
            to.Actions.ForEach(el =>
            {
                IWorkflowAction defaultAction = this.Scan(el.ID);
                if (defaultAction != null)
                {
                    partAction.Add(defaultAction);
                }
            });
            return partAction;
        }
    }
}
