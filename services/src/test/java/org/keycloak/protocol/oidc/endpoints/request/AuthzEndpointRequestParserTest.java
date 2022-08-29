package org.keycloak.protocol.oidc.endpoints.request;

import org.junit.Test;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class AuthzEndpointRequestParserTest {
  
  
  @Test
  public void testExtractAdditionalReqParams() {
    
    TestAuthzEndpointRequestParser test = new TestAuthzEndpointRequestParser();

    Map<String, String> additionalReqParams = new HashMap<>();
    
    test.extractAdditionalReqParams(additionalReqParams);
    
    assertNotNull(additionalReqParams);
    assertEquals(1, additionalReqParams.size());
    assertTrue(additionalReqParams.containsKey("hash"));
    
  }
  
  
  private class TestAuthzEndpointRequestParser extends AuthzEndpointRequestParser {

    @Override
    protected String getParameter(String paramName) {
      return "VER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaMVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaMVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaMVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaMVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaMVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM%2CVER2CFYJFMliVLAFlYUUE9Vj4FkbIhHq1Ufe_VnWcsY%2C7P2xRG3WGTXogxuhXOfIrZsfL8lrnCE-G7E95chcwBw%2C9ba29mAU6sK4O9cBk22sGe9bK0Y5ilNycVVx0yij5SM%2Cw6HfN_o5gO7s39azUBWTyCBQiEbbihAGddwr9eUteFA%2CjYYPTQT4nz79AYMNOM67TcnDABQXOMWK0yJ_91EXwaM";
    }

    @Override
    protected Integer getIntParameter(String paramName) {
      return 10;
    }

    @Override
    protected Set<String> keySet() {
      
      Set<String> parameterSet = new HashSet<>();
      parameterSet.add("hash");
      parameterSet.add("customParameter1");
      parameterSet.add("customParameter2");
      parameterSet.add("client_id");
      
      return parameterSet;
    }
  }
  
  
}
