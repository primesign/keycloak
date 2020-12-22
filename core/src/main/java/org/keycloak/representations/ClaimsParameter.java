package org.keycloak.representations;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.node.ValueNode;
import java.util.List;
import java.util.Map;

public class ClaimsParameter {

  @JsonProperty("userinfo")
  protected Map<String, ClaimRequest> userinfo;

  @JsonProperty("id_token")
  protected Map<String, ClaimRequest> idToken;

  public Map<String, ClaimRequest> getUserinfo() {
    return userinfo;
  }

  public void setUserinfo(Map<String, ClaimRequest> userinfo) {
    this.userinfo = userinfo;
  }

  public Map<String, ClaimRequest> getIdToken() {
    return idToken;
  }

  public void setIdToken(Map<String, ClaimRequest> idToken) {
    this.idToken = idToken;
  }

  public static class ClaimRequest {

    @JsonProperty("essential")
    protected boolean essential;

    @JsonProperty("value")
    protected ValueNode value;

    @JsonProperty("values")
    protected List<ValueNode> values;

    public boolean isEssential() {
      return essential;
    }

    public void setEssential(boolean essential) {
      this.essential = essential;
    }

    public ValueNode getValue() {
      return value;
    }

    public void setValue(ValueNode value) {
      this.value = value;
    }

    public List<ValueNode> getValues() {
      return values;
    }

    public void setValues(List<ValueNode> values) {
      this.values = values;
    }
  }

}
