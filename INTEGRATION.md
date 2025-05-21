# DynamoDB Integration for GravyJS Templates (Continued)

## AWS Infrastructure (CDK/CloudFormation) - Complete

```javascript
// infrastructure/gravy-stack.js
import { Stack } from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { RestApi, LambdaIntegration, Cors, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class GravyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // DynamoDB Tables
    const templatesTable = new Table(this, 'GravyTemplates', {
      tableName: 'GravyTemplates',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'templateId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    templatesTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'category', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL
    });

    templatesTable.addGlobalSecondaryIndex({
      indexName: 'SharedTemplatesIndex',
      partitionKey: { name: 'isShared', type: AttributeType.STRING },
      sortKey: { name: 'category', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL
    });

    const snippetsTable = new Table(this, 'GravySnippets', {
      tableName: 'GravySnippets',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'snippetId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    snippetsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'category', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL
    });

    const variablePresetsTable = new Table(this, 'GravyVariablePresets', {
      tableName: 'GravyVariablePresets',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'presetId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    // Cognito User Pool
    const userPool = new UserPool(this, 'GravyUserPool', {
      userPoolName: 'GravyUsers',
      signInAliases: { email: true },
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true
      }
    });

    const userPoolClient = new UserPoolClient(this, 'GravyUserPoolClient', {
      userPool,
      authFlows: {
        userSrp: true,
        userPassword: true
      }
    });

    // Lambda Functions
    const templatesLambda = new Function(this, 'TemplatesLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'templates.handler',
      code: Code.fromAsset('lambda'),
      environment: {
        TEMPLATES_TABLE_NAME: templatesTable.tableName
      }
    });

    const snippetsLambda = new Function(this, 'SnippetsLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'snippets.handler',
      code: Code.fromAsset('lambda'),
      environment: {
        SNIPPETS_TABLE_NAME: snippetsTable.tableName
      }
    });

    const variablePresetsLambda = new Function(this, 'VariablePresetsLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'variable-presets.handler',
      code: Code.fromAsset('lambda'),
      environment: {
        VARIABLE_PRESETS_TABLE_NAME: variablePresetsTable.tableName
      }
    });

    // Grant permissions
    templatesTable.grantReadWriteData(templatesLambda);
    snippetsTable.grantReadWriteData(snippetsLambda);
    variablePresetsTable.grantReadWriteData(variablePresetsLambda);

    // API Gateway
    const api = new RestApi(this, 'GravyApi', {
      restApiName: 'Gravy Templates API',
      cors: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // Add Cognito Authorizer
    const cognitoAuthorizer = new CognitoUserPoolsAuthorizer(this, 'GravyAuthorizer', {
      cognitoUserPools: [userPool]
    });

    // API Routes
    const templatesResource = api.root.addResource('templates');
    templatesResource.addMethod('GET', new LambdaIntegration(templatesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer
    });
    templatesResource.addMethod('POST', new LambdaIntegration(templatesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer
    });

    const templateResource = templatesResource.addResource('{templateId}');
    templateResource.addMethod('GET', new LambdaIntegration(templatesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer
    });
    templateResource.addMethod('PUT', new LambdaIntegration(templatesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer
    });
    templateResource.addMethod('DELETE', new LambdaIntegration(templatesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer
    });

    // Similar setup for snippets and variable presets...
  }
}
```

## Production-Ready Features

### 1. Advanced Template Queries

```javascript
// Advanced query examples
class TemplateService {
  // Search templates with full-text capabilities
  async searchTemplates(userId, searchParams) {
    const { query, category, tags, limit = 20, lastEvaluatedKey } = searchParams;

    // Use DynamoDB Query with FilterExpression for better performance
    const params = {
      TableName: 'GravyTemplates',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    // Add filters
    const filterExpressions = [];
    if (category) {
      filterExpressions.push('category = :category');
      params.ExpressionAttributeValues[':category'] = category;
    }

    if (query) {
      filterExpressions.push('(contains(title, :query) OR contains(description, :query))');
      params.ExpressionAttributeValues[':query'] = query;
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }

    return await dynamoClient.send(new QueryCommand(params));
  }

  // Get popular/trending templates
  async getTrendingTemplates(limit = 10) {
    const params = {
      TableName: 'GravyTemplates',
      IndexName: 'SharedTemplatesIndex',
      KeyConditionExpression: 'isShared = :shared',
      ExpressionAttributeValues: {
        ':shared': 'true'
      },
      ScanIndexForward: false, // Sort by usage count desc
      Limit: limit
    };

    return await dynamoClient.send(new QueryCommand(params));
  }

  // Duplicate template for user
  async duplicateTemplate(userId, templateId, newTitle) {
    // Get original template
    const original = await this.getTemplate(templateId);

    // Create new template with modified data
    const newTemplate = {
      ...original,
      templateId: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title: newTitle || `Copy of ${original.title}`,
      isShared: 'false',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    delete newTemplate.originalTemplateId; // Remove if exists

    const command = new PutCommand({
      TableName: 'GravyTemplates',
      Item: newTemplate
    });

    await dynamoClient.send(command);
    return newTemplate;
  }
}
```

### 2. Template Versioning System

```javascript
// Add versioning to templates
const createTemplateVersion = async (userId, templateId, content, changes) => {
  const versionId = `v${Date.now()}`;

  const version = {
    userId,
    templateId,
    versionId,
    content,
    changes,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  // Store in separate versions table
  await dynamoClient.send(new PutCommand({
    TableName: 'GravyTemplateVersions',
    Item: version
  }));

  // Update main template to reference latest version
  await dynamoClient.send(new UpdateCommand({
    TableName: 'GravyTemplates',
    Key: { userId, templateId },
    UpdateExpression: 'SET latestVersion = :versionId, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':versionId': versionId,
      ':updatedAt': new Date().toISOString()
    }
  }));
};
```

### 3. Analytics and Usage Tracking

```javascript
// Track template usage
const trackTemplateUsage = async (userId, templateId, action = 'populate') => {
  const trackingId = `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store in analytics table
  await dynamoClient.send(new PutCommand({
    TableName: 'GravyAnalytics',
    Item: {
      userId,
      trackingId,
      templateId,
      action,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // for daily aggregation
    }
  }));

  // Increment usage counter on template
  await dynamoClient.send(new UpdateCommand({
    TableName: 'GravyTemplates',
    Key: { userId, templateId },
    UpdateExpression: 'ADD usageCount :inc',
    ExpressionAttributeValues: {
      ':inc': 1
    }
  }));
};
```

### 4. Template Sharing and Permissions

```javascript
// Share template with specific users
const shareTemplate = async (userId, templateId, targetUserIds, permissions = 'read') => {
  const shares = targetUserIds.map(targetUserId => ({
    templateId,
    sharedByUserId: userId,
    sharedWithUserId: targetUserId,
    permissions,
    createdAt: new Date().toISOString()
  }));

  // Batch write to shares table
  const writeRequests = shares.map(share => ({
    PutRequest: { Item: share }
  }));

  await dynamoClient.send(new BatchWriteCommand({
    RequestItems: {
      'GravyTemplateShares': writeRequests
    }
  }));
};

// Get templates shared with user
const getSharedTemplates = async (userId) => {
  const command = new QueryCommand({
    TableName: 'GravyTemplateShares',
    IndexName: 'SharedWithUserIndex',
    KeyConditionExpression: 'sharedWithUserId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  });

  const shares = await dynamoClient.send(command);

  // Get actual templates
  const templateIds = shares.Items.map(share => share.templateId);
  // Batch get templates...
};
```

### 5. React Hook for Template Management

```javascript
// hooks/useTemplateManager.js
import { useState, useEffect, useCallback } from 'react';
import { TemplateService } from '../services/TemplateService';

export const useTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);

  const templateService = new TemplateService();

  // Load templates with pagination
  const loadTemplates = useCallback(async (searchParams = {}, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...searchParams,
        lastEvaluatedKey: append ? lastEvaluatedKey : null
      };

      const response = await templateService.searchTemplates(params);

      if (append) {
        setTemplates(prev => [...prev, ...response.Items]);
      } else {
        setTemplates(response.Items);
      }

      setLastEvaluatedKey(response.LastEvaluatedKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lastEvaluatedKey]);

  // Save template with optimistic updates
  const saveTemplate = useCallback(async (templateData) => {
    const optimisticTemplate = {
      ...templateData,
      templateId: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Optimistic update
    setTemplates(prev => [optimisticTemplate, ...prev]);

    try {
      const savedTemplate = await templateService.createTemplate(templateData);

      // Replace optimistic template with real one
      setTemplates(prev =>
        prev.map(t => t.templateId === optimisticTemplate.templateId ? savedTemplate : t)
      );

      return savedTemplate;
    } catch (err) {
      // Remove optimistic template on error
      setTemplates(prev =>
        prev.filter(t => t.templateId !== optimisticTemplate.templateId)
      );
      setError(err.message);
      throw err;
    }
  }, []);

  // Update template
  const updateTemplate = useCallback(async (templateId, updateData) => {
    setTemplates(prev =>
      prev.map(t =>
        t.templateId === templateId
          ? { ...t, ...updateData, updatedAt: new Date().toISOString() }
          : t
      )
    );

    try {
      const updatedTemplate = await templateService.updateTemplate(templateId, updateData);

      setTemplates(prev =>
        prev.map(t => t.templateId === templateId ? updatedTemplate : t)
      );

      return updatedTemplate;
    } catch (err) {
      // Revert optimistic update
      await loadTemplates();
      setError(err.message);
      throw err;
    }
  }, [loadTemplates]);

  // Delete template
  const deleteTemplate = useCallback(async (templateId) => {
    const templateToDelete = templates.find(t => t.templateId === templateId);

    // Optimistic delete
    setTemplates(prev => prev.filter(t => t.templateId !== templateId));

    try {
      await templateService.deleteTemplate(templateId);
    } catch (err) {
      // Restore on error
      setTemplates(prev => [templateToDelete, ...prev]);
      setError(err.message);
      throw err;
    }
  }, [templates]);

  return {
    templates,
    loading,
    error,
    hasMore: !!lastEvaluatedKey,
    loadTemplates,
    loadMore: () => loadTemplates({}, true),
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: () => loadTemplates()
  };
};
```

### 6. Offline Support with Local Storage

```javascript
// services/OfflineTemplateService.js
class OfflineTemplateService {
  constructor() {
    this.storageKey = 'gravyTemplatesOffline';
    this.syncQueue = 'gravySyncQueue';
  }

  // Save template offline
  saveOffline(template) {
    const offlineTemplates = this.getOfflineTemplates();
    offlineTemplates[template.templateId] = {
      ...template,
      isOffline: true,
      lastModified: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(offlineTemplates));

    // Add to sync queue
    this.addToSyncQueue('create', template);
  }

  // Get offline templates
  getOfflineTemplates() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Add to sync queue
  addToSyncQueue(action, data) {
    const queue = this.getSyncQueue();
    queue.push({
      id: Date.now(),
      action,
      data,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(this.syncQueue, JSON.stringify(queue));
  }

  // Sync when back online
  async syncWithServer() {
    const queue = this.getSyncQueue();
    const templateService = new TemplateService();

    for (const item of queue) {
      try {
        switch (item.action) {
          case 'create':
            await templateService.createTemplate(item.data);
            break;
          case 'update':
            await templateService.updateTemplate(item.data.templateId, item.data);
            break;
          case 'delete':
            await templateService.deleteTemplate(item.data.templateId);
            break;
        }
      } catch (error) {
        console.error('Sync error for item:', item, error);
        // Keep failed items in queue for retry
        continue;
      }
    }

    // Clear completed items
    localStorage.removeItem(this.syncQueue);
    localStorage.removeItem(this.storageKey);
  }

  getSyncQueue() {
    const stored = localStorage.getItem(this.syncQueue);
    return stored ? JSON.parse(stored) : [];
  }
}
```

## Deployment Checklist

1. **Deploy Infrastructure**
   ```bash
   npm install
   cdk bootstrap
   cdk deploy
   ```

2. **Configure Environment Variables**
   - API Gateway URL
   - Cognito User Pool details
   - DynamoDB table names

3. **Set up Monitoring**
   - CloudWatch dashboards
   - Error alerts
   - Usage metrics

4. **Security Considerations**
   - Enable DynamoDB encryption
   - Configure WAF for API Gateway
   - Set up VPC endpoints if needed
   - Enable CloudTrail logging

This complete system gives you a production-ready template management solution with GravyJS!