from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.crud.base import CRUDBase

# Maps Pydantic schema field names  →  actual column names in schema.sql
_CASE_FIELD_MAP = {
    "case_number":        "inquest_no",
    "assigned_jmo_id":    "assigned_jmo_id",   # not in schema.sql Cases table — stored separately
    "police_station_id":  "police_station_id",  # not in schema.sql Cases table
    "court_id":           "court_id",           # not in schema.sql Cases table
}

class CRUDCase(CRUDBase):
    # ── Read: map DB columns back to API response field names ─────────────
    def _map_row(self, row) -> Optional[Dict[str, Any]]:
        if not row:
            return None
        row_dict = dict(row)
        # Rename primary key
        if "case_id" in row_dict:
            row_dict["id"] = row_dict.pop("case_id")
        # Expose inquest_no as case_number (matches Pydantic schema)
        if "inquest_no" in row_dict:
            row_dict["case_number"] = row_dict.pop("inquest_no")
        # Ensure fields not in schema.sql but in Pydantic schema are present
        row_dict.setdefault("assigned_jmo_id", None)
        row_dict.setdefault("police_station_id", None)
        row_dict.setdefault("court_id", None)
        row_dict.setdefault("deceased_persons", [])
        row_dict.setdefault("injured_persons", [])
        return row_dict

    # ── Write: translate Pydantic names → DB column names ─────────────────
    def _to_db_fields(self, obj_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map Pydantic schema field names to the actual schema.sql column names."""
        db_data = {}
        for key, value in obj_data.items():
            if value is None:
                continue  # skip NULL fields — let DB use defaults
            if key == "case_number":
                db_data["inquest_no"] = value
            elif key in ("assigned_jmo_id", "police_station_id", "court_id"):
                # These columns do not exist in the Cases table per schema.sql.
                # They are skipped here; add them to the schema if required.
                continue
            else:
                db_data[key] = value
        return db_data

    def create(self, db: Session, *, obj_in: Any) -> Dict[str, Any]:
        obj_data = obj_in.model_dump(exclude_unset=True)
        db_data = self._to_db_fields(obj_data)

        if not db_data:
            raise ValueError("No valid fields to insert into Cases table.")

        columns = ", ".join(db_data.keys())
        placeholders = ", ".join([f":{k}" for k in db_data.keys()])
        query = f"INSERT INTO Cases ({columns}) VALUES ({placeholders}) RETURNING case_id"
        new_id = db.execute(text(query), db_data).scalar()
        db.commit()
        return self.get(db, new_id)

    def get_by_case_number(self, db: Session, *, case_number: str) -> Optional[Dict[str, Any]]:
        result = db.execute(
            text("SELECT * FROM Cases WHERE inquest_no = :n OR court_case_no = :n"),
            {"n": case_number}
        ).mappings().first()
        return self._map_row(result)

    def get_cases_with_filters(
        self, db: Session, *,
        status: Optional[str] = None,
        case_type_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        query = "SELECT * FROM Cases WHERE 1=1"
        params: Dict[str, Any] = {"limit": limit, "skip": skip}
        if status:
            query += " AND UPPER(status) = UPPER(:status)"
            params["status"] = status
        if case_type_id:
            query += " AND case_type_id = :case_type_id"
            params["case_type_id"] = case_type_id
        query += " ORDER BY case_id DESC LIMIT :limit OFFSET :skip"
        results = db.execute(text(query), params).mappings().all()
        return [self._map_row(row) for row in results]

case = CRUDCase("Cases", "case_id")
case_type = CRUDBase("Case_Types", "case_type_id")
deceased = CRUDBase("Deceased_Persons", "deceased_id")
injured = CRUDBase("Injured_Persons", "injured_id")

