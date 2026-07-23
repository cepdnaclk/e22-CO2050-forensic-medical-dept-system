from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

class CRUDBase:
    def __init__(self, table_name: str, id_column: str = "id"):
        self.table_name = table_name
        self.id_column = id_column

    def _map_row(self, row) -> Optional[Dict[str, Any]]:
        if not row:
            return None
        row_dict = dict(row)
        if self.id_column in row_dict:
            row_dict["id"] = row_dict.pop(self.id_column)
        return row_dict

    def get(self, db: Session, id: Any) -> Optional[Dict[str, Any]]:
        result = db.execute(
            text(f"SELECT * FROM {self.table_name} WHERE {self.id_column} = :id"),
            {"id": id}
        ).mappings().first()
        return self._map_row(result)

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        results = db.execute(
            text(f"SELECT * FROM {self.table_name} LIMIT :limit OFFSET :skip"),
            {"limit": limit, "skip": skip}
        ).mappings().all()
        return [self._map_row(row) for row in results]

    def create(self, db: Session, *, obj_in: Any) -> Dict[str, Any]:
        obj_data = obj_in.model_dump(exclude_unset=True)
        # Ensure we don't try to insert 'id' into the id_column automatically unless specified
        if "id" in obj_data:
            obj_data[self.id_column] = obj_data.pop("id")
            
        columns = ", ".join(obj_data.keys())
        values_placeholders = ", ".join([f":{k}" for k in obj_data.keys()])
        
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({values_placeholders}) RETURNING {self.id_column}"
        result = db.execute(text(query), obj_data).scalar()
        db.commit()
        
        return self.get(db, result)

    def update(self, db: Session, *, db_obj: Dict[str, Any], obj_in: Any) -> Dict[str, Any]:
        obj_data = obj_in.model_dump(exclude_unset=True)
        if "id" in obj_data:
            obj_data.pop("id")
            
        set_clause = ", ".join([f"{k} = :{k}" for k in obj_data.keys()])
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE {self.id_column} = :id"
        obj_data["id"] = db_obj.get("id", db_obj.get(self.id_column))
        db.execute(text(query), obj_data)
        db.commit()
        return self.get(db, obj_data["id"])

    def remove(self, db: Session, *, id: int) -> Dict[str, Any]:
        obj = self.get(db, id=id)
        db.execute(
            text(f"DELETE FROM {self.table_name} WHERE {self.id_column} = :id"),
            {"id": id}
        )
        db.commit()
        return obj
