import { Separator } from "@/components/ui/separator";

export default function TermsAndConditions() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					TÉRMINOS Y CONDICIONES
				</h1>
				<p className="text-muted-foreground">OrthoPlanner3D™</p>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						1. ACEPTACIÓN DE LOS TÉRMINOS
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						Al acceder y utilizar los servicios ofrecidos por
						OrthoPlanner3D™ (en adelante, "la Plataforma"), usted
						acepta quedar legalmente vinculado por los presentes
						Términos y Condiciones. Si no está de acuerdo con alguna
						parte de estos términos, no utilice la Plataforma.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						2. DESCRIPCIÓN DEL SERVICIO
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						OrthoPlanner3D™ ofrece un servicio digital de
						planificación ortodóncica, destinado exclusivamente a
						profesionales de la salud dental. La Plataforma permite
						cargar información clínica y diagnóstica con el objetivo
						de recibir planificaciones digitales basadas en los
						datos provistos.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						3. RESPONSABILIDAD DEL CLIENTE
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed mb-4 text-base">
						El profesional tratante (el "Cliente") es el único
						responsable de:
					</p>
					<ul className="list-disc list-inside space-y-2 text-foreground text-base">
						<li>
							Contar con el consentimiento informado de sus
							pacientes para el tratamiento de sus datos.
						</li>
						<li>
							Brindar información clínica completa, veraz y
							actualizada.
						</li>
						<li>
							Evaluar la pertinencia del uso de los recursos
							generados por la Plataforma.
						</li>
						<li>
							Supervisar y ejecutar el tratamiento de manera
							profesional y ética.
						</li>
					</ul>
					<p className="text-foreground leading-relaxed mt-4 text-base">
						OrthoPlanner3D™ no diagnostica, trata ni realiza
						atención clínica directa a pacientes.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						4. CALIDAD DE LOS DATOS Y LIMITACIONES DEL SERVICIO
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed mb-4 text-base">
						La precisión y eficacia de las planificaciones dependen
						directamente de la calidad de los recursos entregados
						(escaneos, imágenes, radiografías e información
						clínica). La Plataforma trabaja bajo criterio clínico
						profesional, pero el servicio no garantiza resultados
						específicos ni constituye una ciencia exacta.
					</p>
					<p className="text-foreground leading-relaxed mb-4 text-base">
						El éxito del tratamiento ortodóncico depende, entre
						otros factores, de:
					</p>
					<ul className="list-disc list-inside space-y-2 text-foreground mb-4 text-base">
						<li>La calidad de los estudios proporcionados.</li>
						<li>
							La planificación y ejecución clínica del profesional
							tratante.
						</li>
						<li>
							La calidad de manufactura de los alineadores o
							dispositivos utilizados.
						</li>
						<li>
							La colaboración del paciente en el uso correcto del
							tratamiento.
						</li>
					</ul>
					<p className="text-foreground leading-relaxed text-base">
						El Cliente reconoce que pueden existir molestias propias
						del proceso ortodóncico, o derivadas de condiciones
						preexistentes del paciente, sin que ello implique
						responsabilidad por parte de OrthoPlanner3D™.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						5. CONFIDENCIALIDAD Y USO DE CASOS CLÍNICOS
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						El Cliente autoriza a OrthoPlanner3D™ a utilizar
						imágenes, escaneos y elementos clínicos de los casos
						cargados con fines de estudio, formación profesional y
						marketing, siempre que dichos datos sean anonimizados y
						no contengan información que permita identificar al
						paciente.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						6. USO ADECUADO DE LA PLATAFORMA
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						Queda prohibido utilizar la Plataforma para actividades
						contrarias a la ley, a la ética profesional o sin contar
						con las debidas autorizaciones y consentimientos.
						OrthoPlanner3D™ podrá suspender o cancelar el acceso al
						servicio ante cualquier uso indebido.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						7. MODIFICACIONES A LOS TÉRMINOS
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						OrthoPlanner3D™ se reserva el derecho de modificar estos
						Términos y Condiciones en cualquier momento. Las
						modificaciones serán publicadas y entrarán en vigor
						desde su publicación.
					</p>
				</div>
			</div>

			<div className="mb-8 p-6 bg-background">
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-foreground">
						8. LEGISLACIÓN APLICABLE Y JURISDICCIÓN
					</h2>
				</div>
				<div>
					<p className="text-foreground leading-relaxed text-base">
						La legislación aplicable será la del país donde se
						presta el servicio o donde se encuentre domiciliado el
						titular de los datos, en cumplimiento de la normativa de
						protección de datos correspondiente (incluyendo el GDPR
						de la UE y la Ley 25.326 de Argentina).
					</p>
				</div>
			</div>

			<Separator className="my-8" />
		</div>
	);
}
