import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          POLÍTICA DE PRIVACIDAD DE ORTHOPLANNER3D™
        </h1>
        <p className="text-muted-foreground">
          OrthoPlanner3D™ (en adelante, "la Plataforma") valora y respeta la privacidad de sus usuarios 
          y de los pacientes cuyos datos puedan ser tratados a través del servicio.
        </p>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">1. RESPONSABLE DEL TRATAMIENTO</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            El responsable del tratamiento de los datos personales es OrthoPlanner3D™, actuando como 
            "Encargado del Tratamiento" en relación con los datos de pacientes cargados por sus clientes 
            (profesionales de la salud dental), quienes son los "Responsables del Tratamiento".
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">2. DATOS RECOPILADOS</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed mb-4 text-base">
            Podemos recopilar los siguientes datos:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground text-base">
            <li>Datos identificativos del profesional (nombre, correo electrónico, información de contacto).</li>
            <li>Datos clínicos, imágenes, escaneos, radiografías u otra información relativa a pacientes, cargados por los profesionales.</li>
            <li>Información técnica de navegación (cookies, IP, dispositivo, sistema operativo, etc.).</li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">3. FINALIDADES DEL TRATAMIENTO</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed mb-4 text-base">
            Los datos son tratados para:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground text-base">
            <li>Prestar el servicio de planificación ortodóncica solicitado.</li>
            <li>Mantener la comunicación con el profesional.</li>
            <li>Mejorar la calidad y seguridad del servicio.</li>
            <li>Utilizar datos anonimizados con fines de estudio, formación o marketing, previa autorización.</li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">4. BASE LEGAL PARA EL TRATAMIENTO</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed mb-4 text-base">
            El tratamiento se realiza sobre las siguientes bases legales:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground text-base">
            <li>Consentimiento expreso del profesional.</li>
            <li>Ejecución de un contrato o prestación del servicio.</li>
            <li>Cumplimiento de obligaciones legales.</li>
            <li>Interés legítimo para fines de mejora y seguridad del sistema.</li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">5. COMPARTICIÓN DE DATOS</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            No se cederán datos a terceros, salvo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground mt-4 text-base">
            <li>Para la prestación de servicios tecnológicos (ej. almacenamiento en la nube, herramientas de planificación) que cumplan con normativas de privacidad.</li>
            <li>Por requerimiento legal de autoridades competentes.</li>
            <li>Siempre garantizando acuerdos adecuados de confidencialidad y protección de datos.</li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">6. TRANSFERENCIA INTERNACIONAL DE DATOS</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            Si los datos se almacenan o procesan en servidores ubicados fuera del país de origen, garantizamos 
            que se aplicarán mecanismos legales adecuados (como cláusulas contractuales tipo aprobadas por la UE) 
            para asegurar su protección.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">7. PLAZO DE CONSERVACIÓN</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            Los datos se conservarán mientras dure la relación contractual y durante el tiempo necesario para 
            cumplir con obligaciones legales, o hasta que el responsable solicite su supresión.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">8. DERECHOS DE LOS TITULARES DE LOS DATOS</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed mb-4 text-base">
            Los profesionales y los titulares de datos personales pueden ejercer sus derechos de:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground text-base">
            <li>Acceso</li>
            <li>Rectificación</li>
            <li>Supresión</li>
            <li>Oposición</li>
            <li>Portabilidad</li>
            <li>Limitación del tratamiento</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4 text-base">
            Las solicitudes pueden realizarse a través del responsable del tratamiento (cliente profesional) 
            o según los canales habilitados por la ley local.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">9. MEDIDAS DE SEGURIDAD</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            La Plataforma implementa medidas técnicas y organizativas apropiadas para garantizar la 
            confidencialidad, integridad y disponibilidad de los datos, incluyendo encriptación, controles 
            de acceso y políticas internas de seguridad.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">10. COOKIES Y TECNOLOGÍAS SIMILARES</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            La Plataforma puede utilizar cookies y tecnologías similares para mejorar la experiencia del usuario, 
            analizar patrones de uso y optimizar el servicio. El usuario puede configurar su navegador para 
            aceptar o rechazar el uso de cookies. Para más información, se recomienda consultar la política 
            específica de cookies, si estuviera disponible.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-background">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">11. CAMBIOS EN ESTA POLÍTICA</h2>
        </div>
        <div>
          <p className="text-foreground leading-relaxed text-base">
            OrthoPlanner3D™ se reserva el derecho de actualizar esta Política de Privacidad en cualquier 
            momento. La versión vigente será siempre la publicada en la Plataforma.
          </p>
        </div>
      </div>

      <Separator className="my-8" />
    </div>
  );
}
