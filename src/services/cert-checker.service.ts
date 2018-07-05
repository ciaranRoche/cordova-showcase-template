import { ServiceConfiguration } from "@aerogear/core";
import { Injectable } from "@angular/core";
import { Dialogs } from "@ionic-native/dialogs";
import { HTTP } from "@ionic-native/http";
import { DocumentationService } from "./documentation.service";

declare var url: any;
declare var require: any;
// tslint:disable-next-line:no-var-requires
const appConfig = require("../mobile-services.json");

@Injectable()
export class CertificateCheckerService {

  private configuration: ServiceConfiguration = appConfig.services[0];
  private readonly SSL_ERROR: string = "SSL handshake failed";

  constructor(private http: HTTP, private dialog: Dialogs, public docService: DocumentationService) { }

  public sslHandshakeCheck() {
    if (appConfig.services.length > 0) { this.serviceUrlCheck(); }
  }

  private serviceUrlCheck() {
    this.http.get(this.configuration.url, {}, {})
      .then(() => {
        console.info("SSL handshake successfull");
      }).catch((error) => {
        if (error.error === this.SSL_ERROR) {
          this.dialog.confirm(
            `You may be using self signed certificates that will prevent the showcase from running properly.` +
            ` Please review the documentation and configure your certificates.`,
            "Certificate Error",
            ["Show Documentation", "Close"],
          ).then((result) => {
            if (result === 1) {
              this.docService.open(DocumentationService.SELF_SIGNED_DOCS);
            }
          });
        }
      });
  }
}
