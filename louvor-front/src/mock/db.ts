import { createServer } from "miragejs";
import styles from "./styles.json";

createServer({
  routes() {
    this.get("api/styles", () => {
      return styles;
    });
  },
});
