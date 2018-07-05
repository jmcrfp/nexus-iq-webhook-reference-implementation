/*
 * Copyright (c) 2018-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { assert } = require('chai');
const mapper = require('../src/nexus-webhook-mapper')

describe('nexus-webhook-mapper', () => {
  function getPayload(action) {
    return {
      "timestamp": "2018-07-04T13:18:40.232+0000",
      "nodeId": "3BD2E23A-F1F391AC-22F936E9-230637FD-81DE9D05",
      "initiator": "admin/10.177.176.248",
      "repositoryName": "public-8.2-snapshot",
      "action": action,
      "asset":
      { "id": "db83aea5c3c644ad663b71479219f80a",
        "format": "maven2",
        "name": "pentaho/pentaho-platform-core/8.1.0.0-SNAPSHOT/pentaho-platform-core-8.1.0.0-20180703.163101-79.jar" }
    };
  }

  it('should convert nexus webhook to asset location', () => {
    const message = mapper.map(getPayload("CREATED"));

    assert.equal(message, '/repository/omni/pentaho/pentaho-platform-core/8.1.0.0-SNAPSHOT/pentaho-platform-core-8.1.0.0-20180703.163101-79.jar');
  });

  it('should convert nexus webhook to slack message, no critical', () => {
    const message = mapper.map(getPayload("DELETED"));

    assert.equal(message, undefined);
  });
});
