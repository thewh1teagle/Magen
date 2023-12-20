use std::time::Duration;
use serde_json::Value;
use serde::{Serialize, Deserialize, Serializer};
use uuid::Uuid;
use log::debug;
use serde::ser::SerializeStruct;

pub struct Client {
    alert_id: String,
    mock: bool
}

#[derive(Deserialize, Debug)]
pub struct Alert {
    pub id: String,
    pub category: String,
    pub cities: Vec<String>,
    pub is_test: Option<bool>
}

impl Serialize for Alert {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        
        let mut state = serializer.serialize_struct("Alert", 3)?;

        state.serialize_field("id", &self.id)?;
        state.serialize_field("category", &self.category)?;
        state.serialize_field("cities", &self.cities)?;

        if let Some(is_test) = self.is_test {
            state.serialize_field("is_test", &is_test)?;
        }

        state.end()
    }
}

impl ToString for Alert {
    fn to_string(&self) -> String {
        serde_json::to_string(self).unwrap_or_else(|e| format!("Error converting to JSON: {}", e))
    }
}


impl Client {
    pub fn new() -> Client {
        Client {alert_id: "0".to_string(), mock: false}
    }

    pub fn new_mock() -> Client {
        Client {alert_id: "0".to_string(), mock: true}
    }

    fn parse_response(& mut self, json_str: &str) -> Result<Option<Alert>, Box<dyn std::error::Error + Send + Sync>> {
        debug!("parsing response => {}", json_str);
        if let Ok(json_data) = serde_json::from_str::<Value>(&json_str) {
            let id = json_data.get("id").and_then(|id| id.as_str());
            let category = json_data.get("cat").and_then(|cat| cat.as_str());
            let data = json_data.get("data").and_then(|arr| arr.as_array());
            debug!("id: {} category: {} data {:?}, current {}", id.unwrap_or(""), category.unwrap_or(""), data, self.alert_id);
            match (id,category,data)  {
                (Some(id), Some(category), Some(data)) => {
                    let id = id.parse::<String>()?;
                    let category = category.parse::<String>()?;
                    let cities = data.iter().map(|c| c.as_str().unwrap_or_default().to_string()).collect();      
                    debug!("cities: {:?}", cities);              
                    if id != self.alert_id {
                    debug!("sending");
                    self.alert_id = id.to_owned();
                    return Ok(Some(Alert{id, category, cities, is_test: None}));
                    } else {
                        debug!("alert_id equals to id");
                        return Ok(None);
                    }
                }
                _ => {
                    return Err("cant extract data".into())
                }
            }
        } else {
            debug!("cant parse");
            return Ok(None)
        }
    }
    
    pub fn get_mock_alert(&self) -> Alert {
        let new_id = Uuid::new_v4().to_string();
        let alert = Alert {
            category: "1".to_string(),
            cities: vec!["כרם שלום".to_string(), "קריית אונו".to_string(), "קריית אתא".to_string(), "אילת".to_string(), "לא ידוע".to_string()],
            id: new_id,
            is_test: Some(true)
        };
        return alert;
    }

    pub async fn get_alert(&mut self) -> Result<Option<Alert>, Box<dyn std::error::Error + Send + Sync>> {
        // testing mock
        if self.mock {
            let alert = self.get_mock_alert();
            return Ok(Some(alert));
        }
        let client = reqwest::Client::builder().timeout(Duration::from_secs(3)).build()?;
        debug!("sending request");
        let json_str: String = client
            .get("https://www.oref.org.il/WarningMessages/Alert/alerts.json")
            .header("X-Requested-With", "XMLHttpRequest")
            .header("Referer", "https://www.oref.org.il/")
            .send()
            .await?
            .text()
            .await?;
        debug!("request finished");
    
        if json_str.contains("Access Denied") {
            return Err("You cannot access the pikudhaoref API from outside Israel.".into());
        }
        

        else if let Some(alert) = self.parse_response(json_str.as_str())? {
            return Ok(Some(alert));
        }
        Ok(None)
    }
}
